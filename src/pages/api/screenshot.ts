import chromium  from '@sparticuz/chromium-min';
import { NextApiRequest, NextApiResponse } from 'next';

import puppeteer, { Page } from 'puppeteer-core';

let _page:Page|undefined = undefined;

async function getBrowser() {
  // local development is broken for this 👇
  // but it works in vercel so I'm not gonna touch it
  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-pack.tar`
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

async function getPage() {
  if (_page) return _page;

  const browser = await getBrowser();
  _page = await browser.newPage();
  return _page;
}

function checkUrl(string:string) {
  let url:string|URL = '';
  try {
    url = new URL(string);
  } catch (error) {
    return false;
  }
  return true;
}

export async function getScreenshot(url:string, ratio = 1) {
  const page = await getPage();
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
  await page.setViewport({
    width: 1000,
    height: 600,
    //@ts-ignore
    devicePixelRatio: ratio,
  });
  const file = await page.screenshot();
  return file;
}

export default async (req: NextApiRequest,res: NextApiResponse) => {
    const url = req.query.url as string;
    const ratio = req.query.ratio ? Number(req.query.ratio) : undefined;

  if (!url) return res.status(400).send('No url query specified.');
  if (!checkUrl(url))
    return res.status(400).send('Invalid url query specified.');
  try {
    const file = await getScreenshot(url, ratio);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=604800, max-age=604800'
    );
    res.status(200).end(file);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        'The server encountered an error. You may have inputted an invalid query.'
      );
  }
};