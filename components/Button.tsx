import classNames from "classnames";
import { PropsWithChildren } from "react";

interface Props {
  onClick?: () => void;
  className?: string;
  isPrimary?: boolean;
}

const Button = ({ onClick, className, children, isPrimary = true }: PropsWithChildren<Props>) => {
  return (
    <button
      type="button"
      className={classNames(
        "w-full max-w-[120px] flex justify-center items-center rounded-md shadow-sm p-2 text-base font-medium text-white focus:outline-none",
        className,
        isPrimary && "bg-indigo-600 hover:bg-indigo-700"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
