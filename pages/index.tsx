import type { NextPage } from "next";
import Head from "next/head";
import App from "../components/App";
import { GAME_DESCRIPTION, GAME_TITLE } from "../constants/strings";
import { AlertProvider } from "../context/AlertContext";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{GAME_TITLE}</title>
        <meta name="description" content={GAME_DESCRIPTION} />
      </Head>
      <AlertProvider>
        <App />
      </AlertProvider>
    </>
  );
};

export default Home;
