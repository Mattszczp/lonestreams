import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const CategoryListItem: React.FC<{
  id: string;
  name: string;
  coverArtUrl: string;
}> = ({ id, name, coverArtUrl }) => {
  return (
    <li key={id} className="flex flex-col m-2 w-44">
      <Link href={`/category/${name}`}>
        <Image
          src={coverArtUrl}
          alt={name}
          width={170}
          height={227}
          className="hover:cursor-pointer"
        />
      </Link>
      <Link href={`/category/${name}`}>
        <span className="capitalize text-sm font-bold text-left break-words hover:cursor-pointer">
          {name}
        </span>
      </Link>
    </li>
  );
};

const Home: NextPage = () => {
  const { data } = trpc.useQuery(["twitch.categories"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
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
        <ul className="flex flex-row flex-wrap justify-between">
          {data &&
            data.map((category, i) => (
              <CategoryListItem
                key={i}
                id={category.id}
                name={category.name}
                coverArtUrl={category.coverArtUrl}
              />
            ))}
        </ul>
      </main>
    </>
  );
};
export default Home;
