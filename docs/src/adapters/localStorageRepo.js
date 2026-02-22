const STORAGE_KEY = "projectHub.projects.v1";

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function createLocalStorageRepo(storage) {
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
