import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import showImages from "@/components/showImages"

export default function FileName({photos}) {

  return (
    <div>{showImages(photos)}</div>
  )
}

export async function getServerSideProps(context){
    const prisma = new PrismaClient()
    const session = await getSession(context)
    const photografer = await prisma.photographer.findFirst({
        where : {
            email : session.user.email 
        }
    })

    const photos = await prisma.photos.findMany({
        where : {
            personID : photografer.personID
        }
    })
    return {
        props: {photos}
    }
}