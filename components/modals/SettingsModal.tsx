import { BaseModal } from "./BaseModal";
import { SettingsToggle } from "./SettingsToggle";
import { HARD_MODE_DESCRIPTION, HIGH_CONTRAST_MODE_DESCRIPTION } from "../../constants/strings";
import { clearLocalStorage } from "../../lib/localStorage";
import { isInClient } from "../../lib/dom";
import Button from "../Button";

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
        <Button className="my-2 border-transparent max-w-[120px]" onClick={clearLocalStorageAndReload}>
          Reset Data
        </Button>
      </div>
    </BaseModal>
  );
};
