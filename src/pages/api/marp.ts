// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { marpCli } from "@marp-team/marp-cli"
import fs from "fs";
import { put,list,del } from "@vercel/blob";


export const markdownToPdf =async (context:{markdown:string}):Promise<{
  isSuccessful:boolean;
  message:string;
  url?:string;
}> => {

  const {markdown} = context;

  if(!markdown ||typeof markdown !=="string"){
    return {isSuccessful:false,message:"Please provide markdown"}
}

const tempMdFilePath = `/tmp/pdf.md`
const tempPdfFilePath = `/tmp/pdf.pdf`

fs.writeFileSync(tempMdFilePath,markdown,"utf8");

await marpCli([tempMdFilePath, '--pdf'])
.then((exitStatus:any) => {
  if (exitStatus > 0) {
    console.error(`Failure (Exit status: ${exitStatus})`)
  } else {
    console.log('Success');

    return
  
  }
})
.catch(console.error);

  const buffer = fs.readFileSync(tempPdfFilePath)
  const { url } = await put(tempPdfFilePath, buffer, { access: 'public' });

  deleteOldItems()


  return {isSuccessful:true,message:"Got pdf", url }
}

// TODO: This could be a way to tell my system to deploy this stuff
markdownToPdf.config= {makeNextApi:true}

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
 res.status(200).json(await markdownToPdf(req.body))
}