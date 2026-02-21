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

export function renderProjectList(container, projects) {
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

export function renderEmptyState(emptyState, isEmpty) {
  emptyState.style.display = isEmpty ? "block" : "none";
}
