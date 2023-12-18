import { getMdHtml } from "@/components/getMdHtml";
import {  NextPageContext } from "next";
import React from "react";

class Page extends React.Component {
  static async getInitialProps(ctx: NextPageContext) {
    if (!ctx.res || !ctx.req) {
      return;
    }

    const url = ctx.query?.url;
    const realUrl = Array.isArray(url) ? url?.[0] : url;
  
    if (!realUrl) {
      return { notFound: true };
    }
  
    const response = await fetch(realUrl, { method: "GET" });
    const markdown = await response.text();
    const html = getMdHtml(markdown);

    // console.log({ url: ctx.req.url, pat: ctx.asPath, x: ctx.locale });
    ctx.res.setHeader("Content-type", "text/html");
    ctx.res.write(html);
    ctx.res.end();
  }
}

export default Page;
