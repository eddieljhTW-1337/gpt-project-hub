(() => {
  function createStatusBar() {
    const bar = document.createElement("div");
    bar.setAttribute("role", "status");
    bar.style.cssText =
      "position:sticky;top:0;z-index:9999;background:#0b2f2a;color:#e8fff6;padding:8px 12px;font:12px/1.4 system-ui;border-bottom:2px solid #2bd4a7";
    bar.textContent = "Loading app...";
    document.body.prepend(bar);
    return bar;
  }

  function getErrorMessage(error) {
    if (!error) {
      return "Unknown error";
    }
    if (typeof error === "string") {
      return error;
    }
    if (error.message) {
      return error.message;
    }
    return String(error);
  }

  function showFatalError(error) {
    const banner = document.createElement("div");
    banner.setAttribute("role", "alert");
    banner.style.cssText =
      "position:sticky;top:0;z-index:9999;background:#3c0d0d;color:#fff;padding:12px 16px;font:14px/1.4 system-ui;border-bottom:2px solid #ffb3b3";
    banner.textContent = `App failed to start: ${getErrorMessage(error)}`;
    document.body.prepend(banner);
  }

  function testStorage(storage) {
    if (!storage) {
      return false;
    }
    const key = "__ph_test__";
    try {
      storage.setItem(key, "1");
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  const STORAGE_KEY = "projectHub.projects.v1";

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  function createLocalStorageRepo(storage) {
    function load() {
      if (!storage) {
        return [];
      }
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = safeParse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }

    function persist(items) {
      if (!storage) {
        return;
      }
      storage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function list() {
      return load();
    }

    function get(id) {
      return load().find((item) => item.id === id) || null;
    }

    function save(project) {
      const items = load();
      const index = items.findIndex((item) => item.id === project.id);
      if (index >= 0) {
        items[index] = project;
      } else {
        items.push(project);
      }
      persist(items);
    }

    function remove(id) {
      const items = load().filter((item) => item.id !== id);
      persist(items);
    }

    return {
      list,
      get,
      save,
      remove,
    };
  }

  const PARA_OPTIONS = ["Projects", "Areas", "Resources", "Archives"];

  function createId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizePara(value) {
    if (PARA_OPTIONS.includes(value)) {
      return value;
    }
    return "Projects";
  }

  function normalizeTags(tags) {
    const input = Array.isArray(tags) ? tags : String(tags || "").split(",");
    const cleaned = input
      .map((tag) => String(tag).trim())
      .filter((tag) => tag.length > 0);

    return [...new Set(cleaned.map((tag) => tag.toLowerCase()))];
  }

  function normalizeUrl(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) {
      throw new Error("URL is required");
    }

    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    try {
      new URL(normalized);
    } catch {
      throw new Error("URL is invalid");
    }
    return normalized;
  }

  function validateTitle(value) {
    const title = String(value || "").trim();
    if (!title) {
      throw new Error("Title is required");
    }
    return title;
  }

  function createProject(input, now = new Date().toISOString()) {
    return {
      id: input.id || createId(),
      title: validateTitle(input.title),
      url: normalizeUrl(input.url),
      para: normalizePara(input.para),
      tags: normalizeTags(input.tags),
      note: String(input.note || "").trim(),
      createdAt: input.createdAt || now,
      updatedAt: now,
    };
  }

  function updateProject(existing, updates, now = new Date().toISOString()) {
    return {
      ...existing,
      title: validateTitle(updates.title ?? existing.title),
      url: normalizeUrl(updates.url ?? existing.url),
      para: normalizePara(updates.para ?? existing.para),
      tags: normalizeTags(updates.tags ?? existing.tags),
      note: String(updates.note ?? existing.note || "").trim(),
      updatedAt: now,
    };
  }

  function listProjects(repo) {
    return repo.list();
  }

  function upsertProject(repo, input) {
    if (input.id) {
      const existing = repo.get(input.id);
      if (existing) {
        const updated = updateProject(existing, input);
        repo.save(updated);
        return updated;
      }
    }

    const created = createProject(input);
    repo.save(created);
    return created;
  }

  function deleteProject(repo, id) {
    repo.remove(id);
  }

  function filterProjects(projects, filters) {
    const query = String(filters.query || "").trim().toLowerCase();
    const para = filters.para || "All";
    const tag = String(filters.tag || "").trim().toLowerCase();

    return projects.filter((project) => {
      const matchesPara = para === "All" || project.para === para;
      const matchesTag = !tag || project.tags.includes(tag);

      if (!query) {
        return matchesPara && matchesTag;
      }

      const haystack = [
        project.title,
        project.note,
        project.url,
        project.para,
        ...(project.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesPara && matchesTag && haystack.includes(query);
    });
  }

  function sortProjects(projects, sortKey) {
    const sorted = [...projects];
    if (sortKey === "title-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      return sorted;
    }

    sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return sorted;
  }

  function createTagElement(tag) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    return span;
  }

  function createActionButton(label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.action = action;
    return button;
  }

  function renderProjectList(container, projects) {
    container.innerHTML = "";

    projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = project.id;

      const header = document.createElement("div");
      header.className = "card-header";

      const titleWrap = document.createElement("div");

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = project.title;

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = project.para;

      titleWrap.appendChild(title);
      titleWrap.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "card-actions";
      actions.appendChild(createActionButton("Open", "open"));
      actions.appendChild(createActionButton("Edit", "edit"));
      actions.appendChild(createActionButton("Delete", "delete"));

      header.appendChild(titleWrap);
      header.appendChild(actions);

      const tags = document.createElement("div");
      tags.className = "tags";
      if (project.tags && project.tags.length > 0) {
        project.tags.forEach((tag) => tags.appendChild(createTagElement(tag)));
      }

      const note = document.createElement("p");
      note.textContent = project.note || "";

      card.appendChild(header);
      if (project.tags && project.tags.length > 0) {
        card.appendChild(tags);
      }
      if (project.note) {
        card.appendChild(note);
      }

      container.appendChild(card);
    });
  }

  function renderEmptyState(emptyState, isEmpty) {
    emptyState.style.display = isEmpty ? "block" : "none";
  }

  function initApp({ repo, root }) {
    const form = root.querySelector("#project-form");
    const projectId = root.querySelector("#project-id");
    const titleInput = root.querySelector("#title");
    const urlInput = root.querySelector("#url");
    const paraInput = root.querySelector("#para");
    const tagsInput = root.querySelector("#tags");
    const noteInput = root.querySelector("#note");
    const clearButton = root.querySelector("#clear-btn");

    const searchInput = root.querySelector("#search");
    const filterPara = root.querySelector("#filter-para");
    const filterTag = root.querySelector("#filter-tag");
    const sortSelect = root.querySelector("#sort");

    const listContainer = root.querySelector("#project-list");
    const emptyState = root.querySelector("#empty-state");
    const countBadge = root.querySelector("#count");

    let currentProjects = [];

    function resetForm() {
      projectId.value = "";
      form.reset();
    }

    function refresh() {
      currentProjects = listProjects(repo);

      const filtered = filterProjects(currentProjects, {
        query: searchInput.value,
        para: filterPara.value,
        tag: filterTag.value,
      });

      const sorted = sortProjects(filtered, sortSelect.value);

      renderProjectList(listContainer, sorted);
      renderEmptyState(emptyState, sorted.length === 0);
      countBadge.textContent = String(sorted.length);
      if (typeof window !== "undefined" && window.__appStatus) {
        window.__appStatus(`Loaded ${sorted.length} project(s).`);
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        upsertProject(repo, {
          id: projectId.value || undefined,
          title: titleInput.value,
          url: urlInput.value,
          para: paraInput.value,
          tags: tagsInput.value,
          note: noteInput.value,
        });
        if (typeof window !== "undefined" && window.__appStatus) {
          window.__appStatus("Project saved.");
        }
        resetForm();
        refresh();
      } catch (error) {
        alert(error.message || "Failed to save project");
      }
    });

    clearButton.addEventListener("click", () => {
      resetForm();
    });

    [searchInput, filterPara, filterTag, sortSelect].forEach((element) => {
      element.addEventListener("input", refresh);
      element.addEventListener("change", refresh);
    });

    listContainer.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }
      const card = button.closest(".card");
      if (!card) {
        return;
      }
      const id = card.dataset.id;
      const project = currentProjects.find((item) => item.id === id);
      if (!project) {
        return;
      }

      const action = button.dataset.action;
      if (action === "open") {
        window.location.href = project.url;
        return;
      }

      if (action === "edit") {
        projectId.value = project.id;
        titleInput.value = project.title;
        urlInput.value = project.url;
        paraInput.value = project.para;
        tagsInput.value = project.tags.join(", ");
        noteInput.value = project.note || "";
        return;
      }

      if (action === "delete") {
        const confirmDelete = window.confirm("Delete this project?");
        if (!confirmDelete) {
          return;
        }
        deleteProject(repo, project.id);
        refresh();
      }
    });

    refresh();
  }

  function startApp() {
    try {
      const statusBar = createStatusBar();
      window.__appStatus = (message) => {
        statusBar.textContent = message;
      };

      const storageReady = testStorage(window.localStorage);
      window.__appStatus(
        storageReady ? "Storage OK. Starting..." : "Storage unavailable. Starting..."
      );

      const repo = createLocalStorageRepo(window.localStorage);
      initApp({
        repo,
        root: document,
      });
      document.documentElement.dataset.jsReady = "true";
      window.__appStatus("App ready.");
    } catch (error) {
      showFatalError(error);
    }
  }

  window.addEventListener("error", (event) => {
    showFatalError(event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    showFatalError(event.reason);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
  } else {
    startApp();
  }
})();
