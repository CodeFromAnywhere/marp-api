import { Inter } from "next/font/google";
import { GetServerSideProps, GetStaticProps } from "next";
import { Marpit } from "@marp-team/marpit";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { useHorizontalDraggableDiv } from "@/components/useHorizontalDraggableDiv";
import { getMdHtml } from "@/components/getMdHtml";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props: { markdown: string }) {
  const [isClient, setIsClient] = useState(false);

  useHorizontalDraggableDiv(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { markdown } = props;
  const [md, setMd] = useState(markdown);
  const htmlFile = getMdHtml(md);

  return isClient ? (
    <main className={`${inter.className} w-screen h-screen`}>
      <div className={"flex w-full h-full"}>
        <div className="flex flex-1">
          <textarea
            className="flex flex-1"
            onChange={(e) => setMd(e.target.value)}
          >
            {md}
          </textarea>
        </div>

        <div className="flex flex-1">
          <iframe className="toPrint w-full h-full" srcDoc={htmlFile} />
        </div>
      </div>
    </main>
  ) : (
    <div>Loading</div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const url = context.query?.url;
  const realUrl = Array.isArray(url) ? url?.[0] : url;

  if (!realUrl) {
    return { notFound: true };
  }

  const response = await fetch(realUrl, { method: "GET" });

  const markdown = await response.text();

  const props = { markdown };
  return { props };
};
