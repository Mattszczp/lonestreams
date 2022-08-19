import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const StreamListItem: React.FC<{
  id: string;
  name: string;
  thumbnailUrl: string;
  viewers: number;
}> = ({ id, name, thumbnailUrl, viewers }) => {
  return (
    <div key={id} className="flex flex-col m-2 w-44">
      <Link href={`https://twitch.tv/${name}`}>
        <Image
          src={thumbnailUrl}
          alt={name}
          width={293}
          height={165}
          className="hover:cursor-pointer"
        />
      </Link>
      <Link href={`http://twitch.tv/${name}`}>
        <span className="capitalize text-sm font-bold text-left break-words hover:cursor-pointer">
          {name}
        </span>
      </Link>
      <span className="text-xs">Viewers: {viewers}</span>
    </div>
  );
};

const Category: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;
  if (name === undefined) {
    throw new Error("Category Name is required");
  }
  const { data, hasNextPage, fetchNextPage } = trpc.useInfiniteQuery(
    ["twitch.streams", { category: name.toString(), limit: 51 }],
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
        <title>{name} - LoneStreams</title>
        <meta name="description" content={`Lonely ${name} streams`} />
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
              page.streams.map((stream, i) => (
                <StreamListItem
                  key={i}
                  id={stream.id}
                  name={stream.name}
                  thumbnailUrl={stream.thumbnailUrl}
                  viewers={stream.viewers}
                />
              ))
            )}
          </InfiniteScroll>
        )}
      </main>
    </>
  );
};

export default Category;
