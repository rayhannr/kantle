import "../styles/globals.css";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { THEME_KEY } from "../constants/strings";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" storageKey={THEME_KEY}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
