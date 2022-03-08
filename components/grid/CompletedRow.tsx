import { CharStatus, getGuessStatuses } from "../../lib/statuses";
import { Cell } from "./Cell";
import { unicodeSplit } from "../../lib/words";
import { useEffect, useState } from "react";

type Props = {
  guess: string;
  isRevealing?: boolean;
  isDancing?: boolean;
};

export const CompletedRow = ({ guess, isRevealing, isDancing }: Props) => {
  const [statuses, setStatuses] = useState<CharStatus[]>([]);
  const splitGuess = unicodeSplit(guess);

  useEffect(() => {
    setStatuses(getGuessStatuses(guess));
  }, [guess]);

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} status={statuses[i]} position={i} isCompleted {...{ isRevealing, isDancing }} />
      ))}
    </div>
  );
};
