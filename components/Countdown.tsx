import { pad0, useRemainingTime } from "../lib/time";

const Countdown = ({ time }: { time: ReturnType<typeof useRemainingTime> }) => {
  const remainingTime = `${pad0(time.hours)}:${pad0(time.minutes)}:${pad0(time.seconds)}`;
  return <div className="text-lg font-medium text-slate-900 dark:text-gray-100">{remainingTime}</div>;
};

export default Countdown;
