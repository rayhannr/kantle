import { ReactNode } from "react";
import classnames from "classnames";
import { CharStatus } from "../../lib/statuses";
import { MAX_WORD_LENGTH, REVEAL_TIME_MS } from "../../constants/settings";
import { getStoredIsHighContrastMode } from "../../lib/localStorage";

type Props = {
  children?: ReactNode;
  value: string;
  width?: number;
  status?: CharStatus;
  onClick: (value: string) => void;
  isRevealing?: boolean;
};

export const Key = ({ children, status, width = 40, value, onClick, isRevealing }: Props) => {
  const keyDelayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;
  const isHighContrast = getStoredIsHighContrastMode();

  const classes = classnames(
    "flex items-center justify-center rounded mx-0.5 text-xs md:text-sm lg:text-base font-bold cursor-pointer select-none dark:text-white",
    {
      "transition ease-in-out": isRevealing,
      "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400 text-slate-900": !status,
      "bg-slate-400 hover:bg-slate-500 dark:bg-slate-800 dark:hover:bg-slate-500 text-white": status === "absent",
      "bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white": status === "correct" && isHighContrast,
      "bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white": status === "present" && isHighContrast,
      "bg-green-600 hover:bg-green-500 active:bg-green-700 text-white": status === "correct" && !isHighContrast,
      "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white": status === "present" && !isHighContrast,
    }
  );

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : "unset",
    width: `${width}px`,
    height: "58px",
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value);
    event.currentTarget.blur();
  };

  return (
    <button style={styles} className={classes} onClick={handleClick}>
      {children || value}
    </button>
  );
};
