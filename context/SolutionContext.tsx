import { createContext, PropsWithChildren, useContext } from "react";
import { getWordOfDay } from "../lib/words";

interface SolutionContextValue {
  solution: string;
  solutionIndex: number;
  tomorrow: number;
}

const SolutionContext = createContext<SolutionContextValue | null>({
  solution: "",
  solutionIndex: -1,
  tomorrow: 0,
});

export const useSolution = () => useContext(SolutionContext) as SolutionContextValue;

interface Props {
  timestamp: number;
}

export const SolutionProvider = ({ timestamp, children }: PropsWithChildren<Props>) => {
  const { solution, solutionIndex, tomorrow } = getWordOfDay(timestamp);
  return <SolutionContext.Provider value={{ solution, solutionIndex, tomorrow }}>{children}</SolutionContext.Provider>;
};
