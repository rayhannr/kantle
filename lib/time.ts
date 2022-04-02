import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const getCurrentTime = () => {
  const now = new Date();
  const hours = 23 - now.getHours();
  const minutes = 59 - now.getMinutes();
  const seconds = 59 - now.getSeconds();

  return { hours, minutes, seconds };
};

export function useRemainingTime() {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(getCurrentTime());

  useEffect(() => {
    const t = setInterval(() => {
      const { hours, minutes, seconds } = getCurrentTime();
      if (hours + minutes + seconds === 0) {
        router.replace(router.asPath);
      }

      setRemainingTime({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return remainingTime;
}

export function pad0(n: number): string {
  return n.toString().padStart(2, "0");
}
