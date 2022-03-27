import classNames from "classnames";

type Props = {
  index: number;
  size: number;
  label: string;
  isHighlighted?: boolean;
};

export const Progress = ({ index, size, label, isHighlighted }: Props) => {
  return (
    <div className="flex justify-left m-1">
      <div className="items-center justify-center w-2">{index + 1}</div>
      <div className="w-full ml-2">
        <div
          style={{ width: `${8 + size}%` }}
          className={classNames(
            "text-xs font-semibold text-white p-0.5",
            size === 0 ? "text-center p-0" : "text-right pr-2",
            isHighlighted ? "bg-blue-600" : "bg-slate-400 dark:bg-slate-700"
          )}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
