import { BaseModal } from "./BaseModal";
import { SettingsToggle } from "./SettingsToggle";
import { HARD_MODE_DESCRIPTION, HIGH_CONTRAST_MODE_DESCRIPTION } from "../../constants/strings";
import { clearLocalStorage } from "../../lib/localStorage";
import { isInClient } from "../../lib/dom";
import Button from "../Button";
import { useExtendedTheme } from "../../lib/theme";

type Props = {
  handleClose: () => void;
  isHardMode: boolean;
  handleHardMode: Function;
  isHighContrastMode: boolean;
  handleHighContrastMode: Function;
  isMounted: boolean;
};

export const SettingsModal = ({
  handleClose,
  isHardMode,
  handleHardMode,
  isHighContrastMode,
  handleHighContrastMode,
  isMounted,
}: Props) => {
  const { isDarkMode, setTheme } = useExtendedTheme();
  const clearLocalStorageAndReload = () => {
    if (!isInClient) return;
    clearLocalStorage();
    location.reload();
  };

  return (
    <BaseModal title="Pengaturan" {...{ handleClose, isMounted }}>
      <div className="flex flex-col mt-2 divide-y">
        <SettingsToggle
          settingName="Mode Susah"
          flag={isHardMode}
          handleFlag={handleHardMode}
          description={HARD_MODE_DESCRIPTION}
        />
        <SettingsToggle
          settingName="Mode Gelap"
          flag={isDarkMode}
          handleFlag={() => setTheme(isDarkMode ? "light" : "dark")}
        />
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
