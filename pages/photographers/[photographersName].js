import { PrismaClient } from "@prisma/client"
import Header from "@/components/header"
import Image from "next/image"


export default function photographersName({ photographer }) {
  const {info} = photographer
  console.log(info.photoPreference)
  console.log(info)
  return (
    <div>
      <Header></Header>
      <div>
        <h1>{photographer.firstName + " " + photographer.lastName}</h1>
        <h3>Read more about our photographer {photographer.firstName + " " + photographer.lastName}</h3>
      </div>
      <div>
        <h4>About the photographer</h4>
        <h6>Read more about the photographer here</h6>
      </div>
      <div>
        <Image src="/#" alt="Image of photographer" width={300} height={300} />
        <h2>{photographer.firstName + " " + photographer.lastName}</h2>
        <h6>photographer since {info.careerStart}</h6>
        <h6>About:</h6>
        <p>{info.about}</p>
        <h6>Lens of choice:</h6>
        <p>{info.lens}</p>
        <h6>Favorite Photo:</h6>
        <p>{info.favoritePhoto}</p>
        <h6>Favorite thing to photograph</h6>
        <p>{info.photoPreference}</p>
      </div>
      <div>
        <button><a>See all of {photographer.firstName}s photographs</a></button>
      </div>
      <div>
        <h4>{photographer.firstName}&apos;s top collections</h4>
      </div>

    </div>
  )
}

export async function getServerSideProps(context) {
  const { photographersName } = context.query

  try {
    const prisma = new PrismaClient
    const photographer = await prisma.photographer.findUnique({
      where: {
        user: photographersName
      },
      include: {
        info: true
      },
    })
    console.log(photographer)
    return {
      props: { photographer }
    }
  } catch (error) {
    console.log(error)
  }



}







