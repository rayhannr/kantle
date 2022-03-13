import { useTheme } from "next-themes";

export const useExtendedTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return { resolvedTheme, setTheme, isDarkMode: resolvedTheme === "dark" };
};
