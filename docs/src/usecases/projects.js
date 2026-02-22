import { createProject, updateProject } from "../domain/project.js";

export function listProjects(repo) {
  return repo.list();
}

export function upsertProject(repo, input) {
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

export function deleteProject(repo, id) {
  repo.remove(id);
}

export function filterProjects(projects, filters) {
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

export function sortProjects(projects, sortKey) {
  const sorted = [...projects];
  if (sortKey === "title-asc") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }

  sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return sorted;
}
