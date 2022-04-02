import classNames from "classnames";
import { CheckIcon } from "./Icons";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  label?: string;
  isChecked: boolean;
  value?: string | number | boolean;
}

export const Checkbox = ({ label, isChecked, value, ...props }: CheckboxProps) => {
  return (
    <div className="pt-0 pb-2 pr-0 p-5 relative">
      <label className="flex items-center p-0 text-sm">
        <input
          className="w-0 h-0 border-0 absolute top-0 left-0 hidden"
          type="checkbox"
          value={String(value)}
          checked={isChecked}
          {...props}
        />
        <span
          className={classNames(
            "w-4 h-4 rounded-[2px] border border-slate-400 absolute left-0 top-[2px] flex items-center justify-center cursor-pointer",
            { "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 hover:border-indigo-500": isChecked }
          )}
        >
          {isChecked && <CheckIcon className={classNames("text-base block w-3 h-3", { "text-white": isChecked })} />}
        </span>
        {label && (
          <span className="leading-5 block text-left text-xs text-slate-900 dark:text-white ml-2">{label}</span>
        )}
      </label>
    </div>
  );
};
