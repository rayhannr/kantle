import { BaseModal } from "./BaseModal";
import { SettingsToggle } from "./SettingsToggle";
import { HARD_MODE_DESCRIPTION, HIGH_CONTRAST_MODE_DESCRIPTION } from "../../constants/strings";
import { clearLocalStorage } from "../../lib/localStorage";
import { isInClient } from "../../lib/dom";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  isHardMode: boolean;
  handleHardMode: Function;
  isDarkMode: boolean;
  handleDarkMode: Function;
  isHighContrastMode: boolean;
  handleHighContrastMode: Function;
};

export const SettingsModal = ({
  isOpen,
  handleClose,
  isHardMode,
  handleHardMode,
  isDarkMode,
  handleDarkMode,
  isHighContrastMode,
  handleHighContrastMode,
}: Props) => {
  const clearLocalStorageAndReload = () => {
    if (!isInClient) return;
    clearLocalStorage();
    location.reload();
  };

  return (
    <BaseModal title="Pengaturan" isOpen={isOpen} handleClose={handleClose}>
      <div className="flex flex-col mt-2 divide-y">
        <SettingsToggle
          settingName="Mode Susah"
          flag={isHardMode}
          handleFlag={handleHardMode}
          description={HARD_MODE_DESCRIPTION}
        />
        <SettingsToggle settingName="Mode Gelap" flag={isDarkMode} handleFlag={handleDarkMode} />
        <SettingsToggle
          settingName="Mode Kontras Tinggi"
          flag={isHighContrastMode}
          handleFlag={handleHighContrastMode}
          description={HIGH_CONTRAST_MODE_DESCRIPTION}
        />
        <button
          type="button"
          className="my-2 w-full max-w-[120px] flex justify-center items-center rounded-md border border-transparent shadow-sm p-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none"
          onClick={clearLocalStorageAndReload}
        >
          Reset Data
        </button>
      </div>
    </BaseModal>
  );
};
