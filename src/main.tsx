import React, { lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Settings2, Menu, X, Check } from "lucide-react";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/source-serif-4/latin-400.css";
import "@fontsource/source-serif-4/latin-400-italic.css";
import "@fontsource/source-serif-4/latin-500.css";
import "katex/dist/katex.min.css";
import "./styles.css";
import "./notebook.css";
import { CompassMark } from "./components/Illustrations";
import { AppContext } from "./context";
import {
  freshState,
  STORAGE_KEY,
  validateBackup,
  createSession,
} from "./model";
import { lessons, allQuestions } from "./data";
import type { State, Mode, Question } from "./types";
import {
  Today,
  Course,
  LessonPage,
  Practice,
  Notebook,
  Settings,
  Sources,
} from "./pages";
import { Graph } from "./components/Graph";
import { SessionPage } from "./components/Session";
const Formulary = lazy(() => import("./components/Formulary"));
let initialError = "";
function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? validateBackup(
          JSON.parse(raw),
          new Set(lessons.map((l) => l.id)),
          new Set(allQuestions.map((q) => q.id)),
        )
      : freshState();
  } catch {
    initialError =
      "Saved progress could not be read. This session is using temporary memory. Export your work in Settings before leaving; the existing saved data has been left untouched.";
    return freshState();
  }
}
const initialState = load();
function App() {
  const [state, setState] = useState(initialState),
    [storageError, setStorageError] = useState(initialError),
    [route, setRoute] = useState(location.hash.slice(2) || "today"),
    [menu, setMenu] = useState(false);
  useEffect(() => {
    const change = () => {
      setRoute(location.hash.slice(2) || "today");
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    if (initialError) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError("");
    } catch {
      setStorageError(
        "Your browser could not save this update. Your work remains available in this tab. Export progress in Settings before closing it.",
      );
    }
  }, [state]);
  useEffect(() => {
    document.documentElement.dataset.ink = state.settings.accent ?? "blue";
  }, [state.settings.accent]);
  const go = (path: string) => {
    if (route === path) {
      window.scrollTo(0, 0);
      setMenu(false);
    } else location.hash = "/" + path;
  };
  const start = (title: string, mode: Mode, qs: Question[]) => {
    if (!qs.length) return;
    const session = createSession(title, mode, qs);
    setState((s) => ({
      ...s,
      sessions: { ...s.sessions, [session.id]: session },
    }));
    go(`session/${session.id}`);
  };
  const [page, id] = route.split("/");
  const nav = [
    ["today", "Today"],
    ["course", "The course"],
    ["map", "Knowledge map"],
    ["practice", "Practice"],
    ["formulary", "Formula book"],
    ["notebook", "Notebook"],
  ] as const;
  const label =
    nav.find(([p]) => p === page)?.[1] ??
    (page === "lesson"
      ? "The course"
      : page === "session"
        ? "Practice"
        : page === "settings"
          ? "Preferences"
          : page === "sources"
            ? "About the course"
            : "Today");
  useEffect(() => {
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [route]);
  useEffect(() => {
    document.title = `${label} · AMCOntology`;
  }, [label]);
  let content: React.ReactNode;
  switch (page) {
    case "today":
      content = <Today />;
      break;
    case "course":
      content = <Course key={id ?? "all"} initialDomain={id} />;
      break;
    case "map":
      content = <Graph />;
      break;
    case "lesson":
      content = <LessonPage key={id} id={id} />;
      break;
    case "practice":
      content = <Practice key={id ?? "mixed"} initialMode={id} />;
      break;
    case "formulary":
      content = (
        <Suspense fallback={<p>Opening the formula book…</p>}>
          <Formulary key={id ?? "index"} initialId={id} />
        </Suspense>
      );
      break;
    case "notebook":
      content = <Notebook />;
      break;
    case "settings":
      content = <Settings />;
      break;
    case "sources":
      content = <Sources />;
      break;
    case "session":
      content = <SessionPage id={id} />;
      break;
    default:
      content = (
        <div className="empty">
          <h1>This page is not here.</h1>
          <button className="button" onClick={() => go("today")}>
            Return to today
          </button>
        </div>
      );
  }
  return (
    <AppContext.Provider value={{ state, setState, go, start, storageError }}>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
          document.getElementById("main")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <div className="app-shell">
        <header className="site-header">
          <div className="header-inner">
            <button
              className="brand"
              onClick={() => go("today")}
              aria-label="AMCOntology home"
            >
              <CompassMark />
              <span>AMCOntology</span>
            </button>
            <nav
              id="main-navigation"
              className={`top-navigation ${menu ? "open" : ""}`}
              aria-label="Main navigation"
            >
              {nav.map(([path, text]) => (
                <button
                  key={path}
                  aria-current={
                    page === path ||
                    (path === "course" && page === "lesson") ||
                    (path === "practice" && page === "session")
                      ? "page"
                      : undefined
                  }
                  onClick={() => go(path)}
                >
                  {text}
                </button>
              ))}
              <button
                className="mobile-preferences"
                onClick={() => go("settings")}
              >
                Preferences
              </button>
            </nav>
            <div className="header-controls">
              <label className="track-select">
                <span className="sr-only">Exam track</span>
                <select
                  aria-label="Exam track"
                  value={state.settings.track}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      settings: {
                        ...s.settings,
                        track: Number(e.target.value) as 10 | 12,
                      },
                    }))
                  }
                >
                  <option value="10">AMC 10</option>
                  <option value="12">AMC 12</option>
                </select>
              </label>
              <button
                className="icon-button preferences-button"
                aria-label="Preferences"
                title="Preferences"
                onClick={() => go("settings")}
              >
                <Settings2 size={18} />
              </button>
              <button
                className="navigation-toggle icon-button"
                aria-label={menu ? "Close navigation" : "Open navigation"}
                aria-expanded={menu}
                aria-controls="main-navigation"
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>
        <div className="main-shell">
          {storageError && (
            <div className="storage-banner" role="alert">
              {storageError}
              <button className="text-button" onClick={() => go("settings")}>
                Open backup settings
              </button>
            </div>
          )}
          <main
            id="main"
            tabIndex={-1}
            className={`main-content ${page === "map" ? "map-content" : ""}`}
          >
            {content}
          </main>
          <footer className="site-footer">
            <button className="text-button" onClick={() => go("sources")}>
              Sources & approach
            </button>
            <span className={`save-status ${storageError ? "error" : ""}`}>
              <Check size={13} />
              {storageError
                ? "Save needs attention"
                : "Progress saved on this device"}
            </span>
          </footer>
        </div>
      </div>
    </AppContext.Provider>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
