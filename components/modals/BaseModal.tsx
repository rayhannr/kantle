import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

type Props = {
  title: string;
  children: React.ReactNode;
  handleClose: () => void;
};

export const BaseModal = ({ title, children, handleClose }: Props) => {
  return (
    <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" open onClose={handleClose}>
      <div className="flex items-center justify-center min-h-screen py-10 px-4 text-center sm:block sm:p-0">
        {/* <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          > */}
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        {/* </Transition.Child> */}

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        {/* <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          > */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 dark:bg-gray-800">
          <div className="absolute right-4 top-4">
            <XIcon
              className="h-5 w-5 cursor-pointer stroke-slate-900 dark:stroke-white"
              onClick={() => handleClose()}
            />
          </div>
          <div>
            <div className="text-center">
              <Dialog.Title as="h3" className="text-lg leading-6 font-semibold text-slate-900 dark:text-gray-100">
                {title}
              </Dialog.Title>
              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
        {/* </Transition.Child> */}
      </div>
    </Dialog>
  );
};
