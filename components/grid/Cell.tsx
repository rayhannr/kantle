import { CharStatus } from "../../lib/statuses";
import classnames from "classnames";
import { DANCE_TIME_MS, REVEAL_TIME_MS } from "../../constants/settings";
import { getStoredIsHighContrastMode } from "../../lib/localStorage";

type Props = {
  value?: string;
  status?: CharStatus;
  isRevealing?: boolean;
  isDancing?: boolean;
  isCompleted?: boolean;
  position?: number;
};

export const Cell = ({ value, status, isRevealing, isCompleted, isDancing, position = 0 }: Props) => {
  const isFilled = value && !isCompleted;
  const shouldReveal = isRevealing && isCompleted;
  const shouldDance = isDancing && isCompleted;
  const animationDelay = `${position * (isDancing ? DANCE_TIME_MS : REVEAL_TIME_MS)}ms`;
  const isHighContrast = getStoredIsHighContrastMode();

  const classes = classnames(
    "w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white",
    {
      "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700": !status,
      "border-slate-600 dark:border-slate-500 text-slate-900": value && !status,
      "absent bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700": status === "absent",
      "correct bg-orange-500 text-white border-orange-500": status === "correct" && isHighContrast,
      "present bg-sky-500 text-white border-sky-500": status === "present" && isHighContrast,
      "correct bg-green-600 text-white border-green-600": status === "correct" && !isHighContrast,
      "present bg-amber-500 text-white border-amber-500": status === "present" && !isHighContrast,
      "cell-fill-animation": isFilled,
      "cell-reveal": shouldReveal,
      dance: shouldDance,
    }
  );

  return (
    <div className={classes} style={{ animationDelay }}>
      <div className="letter-container" style={{ animationDelay }}>
        {value}
      </div>
    </div>
  );
};
