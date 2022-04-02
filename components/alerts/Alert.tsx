import { useEffect, useState } from "react";
import classNames from "classnames";

type Props = {
  isOpen: boolean;
  message: string;
  variant?: "success" | "error";
  topMost?: boolean;
};

const IS_OPEN_CLASS = "opacity-100 transition ease-out duration-300";
const IS_NOT_OPEN_CLASS = "opacity-0 transition ease-in duration-100";

export const Alert = ({ isOpen, message, variant = "error" }: Props) => {
  const classes = classNames(
    "fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden",
    {
      "bg-rose-500 text-white": variant === "error",
      "bg-blue-500 text-white": variant === "success",
    }
  );

  const [transitionClassName, setTransitionClassName] = useState<string>(IS_NOT_OPEN_CLASS);

  useEffect(() => {
    const TRANSITION_TIMEOUT = isOpen ? 50 : 0;
    const timeout = setTimeout(() => {
      setTransitionClassName(isOpen ? IS_OPEN_CLASS : IS_NOT_OPEN_CLASS);
    }, TRANSITION_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  return (
    <div className={classNames(classes, transitionClassName)}>
      <div className="p-2">
        <p className="text-sm text-center font-medium">{message}</p>
      </div>
    </div>
  );
};
