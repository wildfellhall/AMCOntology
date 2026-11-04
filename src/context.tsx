import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { State, Question, Mode } from "./types";
export type AppContextValue = {
  state: State;
  setState: Dispatch<SetStateAction<State>>;
  go: (path: string) => void;
  start: (title: string, mode: Mode, qs: Question[]) => void;
  storageError: string;
};
export const AppContext = createContext<AppContextValue>(null!);
export const useApp = () => useContext(AppContext);
