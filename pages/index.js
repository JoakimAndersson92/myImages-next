import Head from 'next/head'
import Header from '@/components/header'
import { PrismaClient } from "@prisma/client"
import showImages from '@/components/showImages'


export default function Home({photos}) {

  return (
    <>
      <Head>
        <title>My images</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>

      {showImages(photos)}

    </>
  )
}

export async function getServerSideProps(context) {
  const prisma = new PrismaClient()

  try {
    const photos = await prisma.photos.findMany()

    return {
      props: {photos}
    };
  } catch (error) {
    console.log(error)
  }
  
}