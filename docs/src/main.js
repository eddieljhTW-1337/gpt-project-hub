import { createLocalStorageRepo } from "./adapters/localStorageRepo.js";
import { initApp } from "./frameworks/app.js";

const repo = createLocalStorageRepo(window.localStorage);

initApp({
  repo,
  root: document,
});
