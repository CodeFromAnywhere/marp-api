// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { put,list,del } from "@vercel/blob";
 
const deleteOldItems = async () => {
  const {blobs} = await list()

 const urlsToDelete = blobs.map(item =>{

  const msAgo = Date.now() - item.uploadedAt.valueOf();

  const isOld = msAgo > 900000;

  if(!isOld){
    return;
  };
  return item.url
 }).filter(x=>!!x).map(x=>x as string)

 if(urlsToDelete.length>0){
 console.log(`deleting old ones: ${urlsToDelete.length}`)
 await del(urlsToDelete)
 } else{
  console.log("NOthing to del")
 }
}

export default async function handler(req: NextApiRequest,res: NextApiResponse) {

  const markdown = req.body.markdown;
  if(typeof markdown !=="string"){
    res.status(421).json({isSuccessful:false,message:"Please provide markdown"})
  }

  const { url } = await put("temp/marp.md", markdown, { access: 'public' });

  res.status(200).json({url:`https://marp-api.vercel.app/?url=${url}`});

}