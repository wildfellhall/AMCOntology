import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, ZoomIn, ZoomOut } from "lucide-react";
import { lessons, lessonById, domains, domainColors } from "../data";
import { useApp } from "../context";
import { lessonStats, visibleLessons } from "../model";
import { Status } from "./Shared";
export function Graph() {
  const { state, go } = useApp();
  const [selected, setSelected] = useState("algebra-transformations");
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(0.9);
  const viewport = useRef<HTMLDivElement>(null);
  const visible = visibleLessons(state, lessons);
  const current = lessonById[selected];
  const mapHeight = 120 + 86 * Math.max(...domains.map(d => lessons.filter(l => l.domain === d).length));
  const positions = useMemo(
    () =>
      Object.fromEntries(
        domains.flatMap((d, c) =>
          lessons
            .filter((l) => l.domain === d)
            .sort((a,b) => Number(b.path === "competition") - Number(a.path === "competition"))
            .map((l, r) => [l.id, { x: 35 + c * 245, y: 65 + r * 86 }]),
        ),
      ),
    [],
  );
  useEffect(() => {
    const p = positions[selected],
      v = viewport.current;
    if (p && v)
      v.scrollTo({
        left: Math.max(0, (p.x + 104) * zoom - v.clientWidth / 2),
        top: Math.max(0, p.y * zoom - v.clientHeight / 3),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [selected, zoom, positions]);
  useEffect(() => {
    if (lessonById[selected].track > state.settings.track)
      setSelected("algebra-transformations");
  }, [state.settings.track, selected]);
  const relatives = new Set([
    selected,
    ...(current?.prerequisites ?? []),
    ...visible
      .filter((l) => l.prerequisites.includes(selected))
      .map((l) => l.id),
  ]);
  const matches = (id: string) =>
    !search ||
    lessonById[id].title.toLowerCase().includes(search.toLowerCase());
  return (
    <>
      <div className="page-heading">
        <h1>Your knowledge map</h1>
        <p>
          Select a concept to see its immediate prerequisites and the lessons it
          opens up.
        </p>
      </div>
      <div className="graph-toolbar">
        <label className="search">
          <Search size={17} />
          <input
            aria-label="Find a concept"
            placeholder="Find a concept…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="button-group">
          <button
            className="icon-button"
            aria-label="Zoom out"
            onClick={() => setZoom((v) => Math.max(0.5, v - 0.1))}
          >
            <ZoomOut size={18} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            className="icon-button"
            aria-label="Zoom in"
            onClick={() => setZoom((v) => Math.min(1.3, v + 0.1))}
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
      <div className="graph-search-results">
        {search &&
          visible
            .filter((l) => matches(l.id))
            .slice(0, 8)
            .map((l) => (
              <button
                key={l.id}
                className="button"
                onClick={() => {
                  setSelected(l.id);
                  setSearch("");
                }}
              >
                {l.title}
                <ArrowRight size={14} />
              </button>
            ))}
        {search && !visible.some((l) => matches(l.id)) && (
          <p className="small muted">No matching concepts in this track.</p>
        )}
      </div>
      <div className="graph-layout">
        <div
          ref={viewport}
          className="graph-scroll"
          tabIndex={0}
          aria-label="Scrollable prerequisite map"
        >
          <svg
            width={2000 * zoom}
            height={mapHeight * zoom}
            viewBox={`0 0 2000 ${mapHeight}`}
            role="group"
            aria-label="Directed concept map. Arrows point from prerequisite to next concept."
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8" fill="var(--art-rule)" />
              </marker>
            </defs>
            {domains.map((d, c) => (
              <text key={d} x={35 + c * 245} y="27" className="graph-domain">
                {d}
              </text>
            ))}
            {visible.flatMap((l) =>
              l.prerequisites.map((id) => {
                const a = positions[id],
                  b = positions[l.id];
                const active = selected === l.id || selected === id;
                return (
                  <path
                    key={`${id}-${l.id}`}
                    d={
                      a.x === b.x
                        ? `M${a.x + 208} ${a.y + 25} C${a.x + 235} ${a.y + 25},${b.x + 235} ${b.y + 25},${b.x + 208} ${b.y + 25}`
                        : `M${a.x + 208} ${a.y + 25} C${a.x + 240} ${a.y + 25},${b.x - 30} ${b.y + 25},${b.x} ${b.y + 25}`
                    }
                    fill="none"
                    stroke={active ? "var(--accent)" : "var(--line)"}
                    strokeWidth={active ? 2 : 1}
                    opacity={active ? 1 : 0.35}
                    markerEnd="url(#arrow)"
                  />
                );
              }),
            )}
            {visible.map((l) => {
              const p = positions[l.id],
                status = lessonStats(state, l.id).status;
              return (
                <g
                  key={l.id}
                  transform={`translate(${p.x},${p.y})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${l.title}. ${status}. Select to inspect prerequisites.`}
                  aria-pressed={selected === l.id}
                  onClick={() => setSelected(l.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(l.id);
                    }
                  }}
                  className="graph-node"
                  opacity={1}
                >
                  <rect
                    width="208"
                    height="52"
                    rx="4"
                    fill={
                      selected === l.id
                        ? "var(--accent-wash)"
                        : relatives.has(l.id)
                          ? "var(--paper-deep)"
                          : "var(--panel)"
                    }
                    stroke={selected === l.id ? "var(--accent)" : "var(--line)"}
                    strokeWidth={selected === l.id ? 2 : 1}
                  />
                  <circle
                    cx="15"
                    cy="26"
                    r="4"
                    fill={
                      status === "secure"
                        ? "var(--accent-strong)"
                        : status === "ready"
                          ? "var(--accent)"
                          : status === "learning"
                            ? "var(--pencil)"
                            : (domainColors[l.domain] ?? "var(--accent)")
                    }
                  />
                  <text x="29" y="23" fontSize="12">
                    {l.title.length > 25 ? l.title.slice(0, 24) + "…" : l.title}
                  </text>
                  <text x="29" y="39" fontSize="10" fill="var(--muted)">
                    {String(l.number).padStart(2, "0")} ·{" "}
                    {l.path === "competition" ? "Competition study" : "Prerequisite reference"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <aside className="graph-detail">
          <div className="eyebrow">Selected concept</div>
          <h2>{current.title}</h2>
          <Status status={lessonStats(state, selected).status} />
          <p>{current.summary}</p>
          {current.techniques && <><div className="small-label">Methods in this study</div><ul className="technique-list">{current.techniques.map(t=><li key={t}>{t}</li>)}</ul></>}
          <div className="small-label">Builds on</div>
          {current.prerequisites.length ? (
            <ul className="link-list">
              {current.prerequisites.map((id) => (
                <li key={id}>
                  <button onClick={() => setSelected(id)}>
                    {lessonById[id].title}
                    <ArrowRight size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small muted">
              A starting foundation. No earlier lesson required.
            </p>
          )}
          <div className="small-label">Leads to</div>
          <ul className="link-list">
            {visible
              .filter((l) => l.prerequisites.includes(selected))
              .map((l) => (
                <li key={l.id}>
                  <button onClick={() => setSelected(l.id)}>
                    {l.title}
                    <ArrowRight size={14} />
                  </button>
                </li>
              ))}
          </ul>
          <button
            className="button primary"
            onClick={() => go(`lesson/${selected}`)}
          >
            Open lesson
            <ArrowRight size={16} />
          </button>
        </aside>
      </div>
      <p className="small muted">
        Arrows show prerequisite → next concept. Readiness recommends a route;
        every lesson stays open. For an accessible list of all connections, use
        the course and each lesson’s prerequisite links.
      </p>
    </>
  );
}
