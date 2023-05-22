import { getSession } from "next-auth/react"
import prisma from "@/components/prisma";
import Header from "@/components/header";
import FormInput from "./formInput";
import { useRouter } from "next/router";
import Link from "next/link";


export default function EditPhotographerPage({ userdata, photos }) {
  const { info } = userdata
  const router = useRouter()

  async function HandleUpdateInfo(e) {
    e.preventDefault()

    const newUserInformation = {
      personID: e.target[0].value,
      country: e.target[1].value,
      city: e.target[2].value,
      about: e.target[3].value,
      camera: e.target[4].value,
      lens: e.target[5].value,
      favoritePhoto: e.target[6].value,
      photoPreference: e.target[7].value,
      careerStart: e.target[8].value
    }


    try {
      const response = await fetch('../../api/users/updatePhotographerInfo', {
        method: 'POST',
        headers: {
          'content-type' : 'application/json'
        },
        body: JSON.stringify(newUserInformation)
      })

      if(response.ok){
        router.push("/")
      }
    } catch (error) {
      console.log(error)
    }
    

  }

  async function HandleUploadPhoto(e) {
    e.preventDefault()
    const formData = new FormData()

    const files = e.target[0].files
    console.log(files)
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i])
    }

    

    const response = await fetch('../../api/images/storeImages', {
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        throw new Error({ error: "Something went wrong with the upload" })
    }
    router.push("/")
    
}

  return (
    <div>
      <Header></Header>
      <h1>Photographer Info Form</h1>
      <form onSubmit={HandleUpdateInfo} method='post'>
        {
          Object.keys(info).map((prop) => {
            if (prop == "personID") {
              return (
                <input
                  key={prop}
                  type="hidden"
                  name={prop}
                  value={userdata.personID}
                />
              )
            }
            return (
              <FormInput
                key={prop}
                type={"text"}
                inputName={prop}
              />
            )
          })
        }
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={HandleUploadPhoto} method="post" accept="image/*">
        <label htmlFor="image">Upload image:
          <input type="file" name="image" multiple required />
        </label>
        <button type="submit">upload</button>
      </form>
        <button><Link href={`/photographers/editPhoto/myPhotos`}>Edit photos</Link></button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  const userdata = await prisma.photographer.findUnique({
    where: {
      email: session.user.email
    },
    include: {
      info: true
    },
  })

  const photos = await prisma.photos.findMany({
    where: {
      personID : userdata.personID
    }
  })


  return {
    props: { 
      userdata,
      photos
     }
  }
}
