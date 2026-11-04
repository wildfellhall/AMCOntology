import { useEffect, useRef, useState } from "react";
import { Check, Feather, X } from "lucide-react";
import { useApp } from "../context";
export function AppearanceControls() {
  const { state, setState } = useApp();
  return (
    <div className="appearance-controls">
      <label>
        Your name <span className="muted">(optional)</span>
        <input
          maxLength={40}
          value={state.settings.name ?? ""}
          placeholder="Name on your study plan"
          onChange={(e) =>
            setState((s) => ({
              ...s,
              settings: { ...s.settings, name: e.target.value },
            }))
          }
        />
      </label>
      <fieldset>
        <legend>Ink color</legend>
        <div className="ink-choices">
          {(
            [
              { id: "blue", label: "Blue ink", color: "#344f64" },
              { id: "plum", label: "Plum ink", color: "#704568" },
              { id: "graphite", label: "Graphite", color: "#454742" },
            ] as const
          ).map((ink) => (
            <button
              key={ink.id}
              type="button"
              aria-pressed={(state.settings.accent ?? "blue") === ink.id}
              onClick={() =>
                setState((s) => ({
                  ...s,
                  settings: { ...s.settings, accent: ink.id },
                }))
              }
            >
              <span style={{ background: ink.color }}>
                {(state.settings.accent ?? "blue") === ink.id && (
                  <Check size={15} />
                )}
              </span>
              {ink.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
export function Personalize() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <>
      <button className="personalize-button" onClick={() => setOpen(true)}>
        <Feather size={15} />
        Personalize
      </button>
      <dialog
        className="personalize-dialog"
        aria-labelledby="personalize-title"
        ref={dialog}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              setOpen(false);
          }
        }}
      >
        <div className="dialog-heading">
          <h2 id="personalize-title">Your manuscript</h2>
          <button
            className="icon-button"
            aria-label="Close personalization"
            onClick={() => setOpen(false)}
          >
            <X size={19} />
          </button>
        </div>
        <AppearanceControls />
        <button className="button primary" onClick={() => setOpen(false)}>
          Done
        </button>
      </dialog>
    </>
  );
}
