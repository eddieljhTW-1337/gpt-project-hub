import {
  listProjects,
  upsertProject,
  deleteProject,
  filterProjects,
  sortProjects,
} from "../usecases/projects.js";
import { renderProjectList, renderEmptyState } from "../adapters/domRenderer.js";

export function initApp({ repo, root }) {
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
