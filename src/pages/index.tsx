import Image from 'next/image'
import { Inter } from 'next/font/google'
import {  GetServerSideProps, GetStaticProps } from 'next'

const inter = Inter({ subsets: ['latin'] })

import {Marpit} from '@marp-team/marpit'
import { useEffect, useState } from 'react'

export default function Home(props:{markdown:string}) {

  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  const {markdown} = props;
  const [md,setMd]=useState(markdown);

  // 1. Create instance (with options if you want)
  const marpit = new Marpit()

// 2. Add theme CSS
const theme = `
/* @theme example */

section {
  background-color: #369;
  color: #fff;
  font-size: 30px;
  padding: 40px;
}

h1,
h2 {
  text-align: center;
  margin: 0;
}

h1 {
  color: #8cf;
}
`
marpit.themeSet.default = marpit.themeSet.add(theme)

// 3. Render markdown

const { html, css } = marpit.render(md)

// 4. Use output in your HTML
const htmlFile = `
<!DOCTYPE html>
<html><body>
  <style>${css}</style>
  ${html}
</body></html>
`;

  return isClient?(
    <main
      className={`${inter.className}`}
    >
        <style>{css}</style>

        <div dangerouslySetInnerHTML={{__html:html}}></div>

    </main>
  ):<div>Loading</div>
}

export const getServerSideProps: GetServerSideProps =async (context)=>{
const url = context.query?.url;
const realUrl =Array.isArray(url)?url?.[0]:url;

if(!realUrl){
  return{notFound:true};
}

const response = await  fetch(realUrl,{method:"GET"});

const markdown=  await response.text()

  const props ={markdown}
  return {props}
}