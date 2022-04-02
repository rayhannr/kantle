import classNames from "classnames";
import { useEffect, useState } from "react";
import { XIcon } from "../Icons";

type Props = {
  title: string;
  children: React.ReactNode;
  handleClose: () => void;
  isMounted: boolean;
};

const OVERLAY_INITIAL_CLASS = "opacity-0";
const CONTENT_INITIAL_CLASS = "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95";
const IS_MOUNTED_CLASS = "ease-out duration-300";
const IS_UNMOUNTED_CLASS = "ease-in duration-200";

const getConditionalClassOnMount = (isMounted: boolean) => {
  return isMounted ? IS_MOUNTED_CLASS : IS_UNMOUNTED_CLASS;
};

export const BaseModal = ({ title, children, handleClose, isMounted }: Props) => {
  const [overlayClassName, setOverlayClassName] = useState<string>(OVERLAY_INITIAL_CLASS);
  const [contentClassName, setContentClassName] = useState<string>(CONTENT_INITIAL_CLASS);

  useEffect(() => {
    const TRANSITION_TIMEOUT = isMounted ? 50 : 0;

    const timeout = setTimeout(() => {
      setOverlayClassName(isMounted ? "opacity-100" : OVERLAY_INITIAL_CLASS);
      setContentClassName(isMounted ? "opacity-100 translate-y-0 sm:scale-100" : CONTENT_INITIAL_CLASS);
    }, TRANSITION_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [isMounted]);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen py-10 px-4 text-center sm:block sm:p-0">
        <div
          onClick={handleClose}
          className={classNames(
            "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity",
            overlayClassName,
            getConditionalClassOnMount(isMounted)
          )}
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div
          className={classNames(
            "inline-block align-bottom bg-white dark:bg-slate-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6",
            contentClassName,
            getConditionalClassOnMount(isMounted)
          )}
        >
          <div className="absolute right-4 top-4">
            <XIcon className="h-5 w-5 cursor-pointer stroke-slate-900 dark:stroke-white" onClick={handleClose} />
          </div>
          <div>
            <div className="text-center">
              <h3 className="text-lg leading-6 font-semibold text-slate-900 dark:text-gray-100">{title}</h3>
              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
        {/* </Transition.Child> */}
      </div>
    </div>
  );
};
