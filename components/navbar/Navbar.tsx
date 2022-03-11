import { ChartBarIcon, CogIcon, InformationCircleIcon } from "@heroicons/react/outline";
import { GAME_NAME } from "../../constants/strings";
import { useSolution } from "../../context/SolutionContext";

type Props = {
  setIsInfoModalOpen: (value: boolean) => void;
  setIsStatsModalOpen: (value: boolean) => void;
  setIsSettingsModalOpen: (value: boolean) => void;
};

export const Navbar = ({ setIsInfoModalOpen, setIsStatsModalOpen, setIsSettingsModalOpen }: Props) => {
  const { solutionIndex } = useSolution();
  return (
    <div className="navbar">
      <div className="navbar-content px-5 mx-auto max-w-md">
        <InformationCircleIcon
          className="h-6 w-6 mr-2 cursor-pointer stroke-slate-900 dark:stroke-white"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <p className="text-xl ml-2.5 font-bold text-slate-900 dark:text-white">
          {GAME_NAME} <sup>#{solutionIndex + 1}</sup>
        </p>
        <div className="right-icons">
          <ChartBarIcon
            className="h-6 w-6 mr-3 cursor-pointer stroke-slate-900 dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className="h-6 w-6 cursor-pointer stroke-slate-900 dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr></hr>
    </div>
  );
};
