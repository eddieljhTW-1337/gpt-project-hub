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

  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
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

export function createProject(input, now = new Date().toISOString()) {
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

export function updateProject(existing, updates, now = new Date().toISOString()) {
  return {
    ...existing,
    title: validateTitle(updates.title ?? existing.title),
    url: normalizeUrl(updates.url ?? existing.url),
    para: normalizePara(updates.para ?? existing.para),
    tags: normalizeTags(updates.tags ?? existing.tags),
    note: String((updates.note ?? existing.note) || "").trim(),
    updatedAt: now,
  };
}

export { PARA_OPTIONS };
