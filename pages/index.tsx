import type { GetServerSidePropsResult, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import App from "../components/App";
import { GAME_DESCRIPTION, GAME_TITLE } from "../constants/strings";
import { AlertProvider } from "../context/AlertContext";
import { SolutionProvider } from "../context/SolutionContext";

interface Props {
  currentTimestamp: number;
}

const Home: NextPage<Props> = ({ currentTimestamp }) => {
  return (
    <>
      <Head>
        <title>{GAME_TITLE}</title>
        <meta name="description" content={GAME_DESCRIPTION} />
        <meta
          name="keywords"
          content="game, permainan, main, tebak, kata, rahasia, clue, petunjuk, wordle, bahasa, indonesia, kbbi, kantle"
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={GAME_TITLE} />
        <meta name="twitter:description" content={GAME_DESCRIPTION} />
        <meta name="twitter:image" content="https://kantle.vercel.app/images/kantle.png" />

        <meta property="og:title" content={GAME_TITLE} />
        <meta property="og:description" content={GAME_DESCRIPTION} />
        <meta property="og:image" content="https://kantle.vercel.app/images/kantle.png" />
        <meta property="og:url" content="https://kantle.vercel.app" />
        <meta property="og:type" content="website" />
        <meta
          property="og:keywords"
          content="game, permainan, main, tebak, kata, rahasia, clue, petunjuk, wordle, bahasa, indonesia, kbbi, kantle"
        />
      </Head>
      <SolutionProvider timestamp={currentTimestamp}>
        <AlertProvider>
          <App />
        </AlertProvider>
      </SolutionProvider>
    </>
  );
};

export default Home;

export function getServerSideProps(): GetServerSidePropsResult<Props> {
  const currentTimestamp = Date.now();
  return {
    props: { currentTimestamp },
  };
}
