import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Category: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;
  if (name === undefined) {
    throw new Error("Category Name is required");
  }
  const { data } = trpc.useQuery(["twitch.streams", name.toString()], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  console.log(data);

  return (
    <>
      <Head>
        <title>{name} - LoneStreams</title>
        <meta name="description" content={`Lonely ${name} streams`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  );
};

export default Category;
