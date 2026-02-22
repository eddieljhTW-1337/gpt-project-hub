import { createLocalStorageRepo } from "./adapters/localStorageRepo.js";
import { initApp } from "./frameworks/app.js";

function showFatalError(error) {
  const banner = document.createElement("div");
  banner.setAttribute("role", "alert");
  banner.style.cssText =
    "position:sticky;top:0;z-index:9999;background:#3c0d0d;color:#fff;padding:12px 16px;font:14px/1.4 system-ui;border-bottom:2px solid #ffb3b3";
  banner.textContent = `App failed to start: ${error?.message || error}`;
  document.body.prepend(banner);
}

function startApp() {
  try {
    const repo = createLocalStorageRepo(window.localStorage);
    initApp({
      repo,
      root: document,
    });
    document.documentElement.dataset.jsReady = "true";
  } catch (error) {
    showFatalError(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}
