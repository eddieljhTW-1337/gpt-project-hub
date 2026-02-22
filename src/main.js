import { createLocalStorageRepo } from "./adapters/localStorageRepo.js";
import { initApp } from "./frameworks/app.js";

function createStatusBar() {
  const bar = document.createElement("div");
  bar.setAttribute("role", "status");
  bar.style.cssText =
    "position:sticky;top:0;z-index:9999;background:#0b2f2a;color:#e8fff6;padding:8px 12px;font:12px/1.4 system-ui;border-bottom:2px solid #2bd4a7";
  bar.textContent = "Loading app…";
  document.body.prepend(bar);
  return bar;
}

function showFatalError(error) {
  const banner = document.createElement("div");
  banner.setAttribute("role", "alert");
  banner.style.cssText =
    "position:sticky;top:0;z-index:9999;background:#3c0d0d;color:#fff;padding:12px 16px;font:14px/1.4 system-ui;border-bottom:2px solid #ffb3b3";
  banner.textContent = `App failed to start: ${error?.message || error}`;
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

function startApp() {
  try {
    const statusBar = createStatusBar();
    window.__appStatus = (message) => {
      statusBar.textContent = message;
    };

    const storageReady = testStorage(window.localStorage);
    window.__appStatus(
      storageReady ? "Storage OK. Starting…" : "Storage unavailable. Starting…"
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
