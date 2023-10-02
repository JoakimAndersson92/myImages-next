import Head from 'next/head'
import ShowImagesNext from '@/components/showImages'
import SearchBar from '@/components/searchbar'
import Image from "next/image";
import prisma from '@/components/prisma';
import Layout from '@/components/layout/layout';
import ShowFeaturedCollection from '@/components/showFeaturedCollection';
import React from "react";


export default function Home({ categories, featuredcol, photos }) {

  

  return (
    <Layout>
      <div className='bg-custom-grey'>
        <Head>
          <title>My images</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>


        <div className="flex justify-center  items-center relative h-[42rem]  mb-11 bg-cover bg-center ">

          <Image
            src={`/appcontent/18048EB5-ACE3-499A-AFE5-D0CCB02513BC.JPG`}
            alt=""
            fill={true}
            className="object-cover w-full"
          />

          <SearchBar categories={categories} />
        </div>
        {featuredcol &&
        <ShowFeaturedCollection featuredcol={featuredcol}/>
        }
        <ShowImagesNext photos={photos}/>
      </div>
    </Layout >
  )
}


export async function getServerSideProps() {
  const categories = await prisma.categories.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  const featuredcollections = await prisma.featuredcollections.findFirst({
    where: {
      id: "1"
    },
    select: {
      collection: true,
    }
  })

  const photos = await prisma.photos.findMany({
    where : {
      size : "small"
    }
  })

  return {
    props: { categories, featuredcol: JSON.parse(JSON.stringify(featuredcollections)), photos }
  }
}
