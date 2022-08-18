import type { NextPage } from "next";
import Head from "next/head";
// import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>LoneStreams</title>
        <meta
          name="description"
          content="Discover new Twitch channels to watch before they become superstars"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Hello World!</h1>
      </main>
    </>
  );
};
export default Home;
