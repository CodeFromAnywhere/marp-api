// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { marpCli } from "@marp-team/marp-cli"
import fs from "fs";
import { put,list,del } from "@vercel/blob";


type Data = {
  isSuccessful:boolean;
  message:string;
  url?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const markdown = req.body.markdown as string;

  if(!markdown ||typeof markdown !=="string"){
      res.status(422).json({isSuccessful:false,message:"Please provide markdown"})
      return;
  }

  fs.writeFileSync('pdf.md',markdown,"utf8");

  await marpCli(['pdf.md', '--pdf'])
  .then((exitStatus:any) => {
    if (exitStatus > 0) {
      console.error(`Failure (Exit status: ${exitStatus})`)
    } else {
      console.log('Success');

      return
    
    }
  })
  .catch(console.error);


  // TODO: this is great, but it's better if this thing responds with an URL
  // that contains the pdf so you can download it there.
  const buffer = fs.readFileSync('pdf.pdf')
  const size = fs.statSync("pdf.pdf")

  const { url } = await put('pdf.pdf', buffer, { access: 'public' });

  
  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', 'attachment; filename=pdf.pdf');
  // res.setHeader('Content-Length', size.size);
  // res.write(buffer, 'binary');
  // res.end();

 res.status(200).json({ isSuccessful:true,message:"Got pdf",url })

 deleteOldItems()

}

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