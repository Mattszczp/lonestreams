import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";
import InfiniteScroll from "react-infinite-scroll-component";

const CategoryListItem: React.FC<{
  id: string;
  name: string;
  coverArtUrl: string;
}> = ({ id, name, coverArtUrl }) => {
  return (
    <div key={id} className="flex flex-col m-2 w-44">
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
    </div>
  );
};

const Home: NextPage = () => {
  const { data, hasNextPage, fetchNextPage } = trpc.useInfiniteQuery(
    ["twitch.categories", { limit: 45 }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
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
        {data && (
          <InfiniteScroll
            hasMore={hasNextPage !== undefined && hasNextPage}
            next={fetchNextPage}
            loader={<span>...</span>}
            dataLength={data.pages.length}
            className="flex flex-row flex-wrap justify-between"
          >
            {data.pages.map((page) =>
              page.categories.map((category, i) => (
                <CategoryListItem
                  key={i}
                  id={category.id}
                  name={category.name}
                  coverArtUrl={category.coverArtUrl}
                />
              ))
            )}
          </InfiniteScroll>
        )}
      </main>
    </>
  );
};
export default Home;
