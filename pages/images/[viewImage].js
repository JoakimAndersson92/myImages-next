import Image from "next/image"
import prisma from "../../components/prisma"
import { getSession, signIn } from "next-auth/react"
import Header from "@/components/header"
import formatCurrency from "@/components/utils/formatCurrency"
import router from "next/router"
import { useContext } from "react"
import { CartContext } from "@/context/cartProvider"

export default function ViewImage({ photo, photographer, session }) {
    const { thumbnailUrl, filename, title, personID, id } = photo
    const { cart, addToCart } = useContext(CartContext)

    async function HandleUpdateInfo(e) {
        e.preventDefault()
        let tagValue
        for (let i = 3; i < 6; i++) {
            if (e.target[i].checked) {
                tagValue = e.target[i].value
                break
            }
            else {
                continue
            }
        }

        const newPhotoInformation = {
            title: e.target[0].value,
            description: e.target[1].value,
            price: e.target[2].value,
            tags: tagValue,
            photoID: id
        }


        try {
            const response = await fetch('../api/images/editPhotoInfo', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newPhotoInformation)
            })

            if (response.ok) {
                router.push("/")

            }
        } catch (error) {
            console.log(error)
        }

    }
    async function handleAddToCart(id) {
        if (!session) {
            return signIn()
        }
        const data = {
            id,
            session
        }
        const result = await fetch('/api/cart/storeCartData', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })

        addToCart(id)
    }
    async function handleDeleteImage() {
        if (window.confirm("Are you sure you want to delete this image?")) {
            const result = await fetch('../api/images/deleteImage', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(id)
            })

            if (result) {
                router.push("/")
            }
        }
    }

    return (
        <div>
            <Header />
            <h1>{title}</h1>
            <Image
                src={`/${thumbnailUrl}`}
                width={800}
                height={600}
                alt={`${title}`}
                onContextMenu={(e) => e.preventDefault()}
            />
            <p>{formatCurrency(photo.price)}</p>
            <p>{photo.description}</p>
            <button onClick={() => handleAddToCart(id)}>Add to cart</button>
            {photographer.personID === personID &&
                <>
                    <form onSubmit={HandleUpdateInfo}>
                        <div>
                            <label htmlFor="title">Title</label>
                            <input id="title" type="text" name="title" required />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <input id="description" type="text" name="description" required />
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input id="price" type="number" name="price" required />
                        </div>
                        <div>

                            <legend>Category</legend>
                            <label htmlFor="sunset">Sunset</label>
                            <input type="radio" id="sunset" name="category" value="sunset" />
                            <label htmlFor="family">Family</label>
                            <input type="radio" id="family" name="category" value="family" />
                            <label htmlFor="ocean">Ocean</label>
                            <input type="radio" id="ocean" name="category" value="ocean" />

                        </div>
                        <div>
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                    <button onClick={handleDeleteImage}>Delete image</button>
                </>
            }

        </div>
    )
}


export async function getServerSideProps(context) {
    const { query } = context
    const session = await getSession(context)
    let photographer = {}

    try {
        const photo = await prisma.photos.findFirst({
            where: {
                filename: query.viewImage
            },
        })

        if (session) {
            photographer = await prisma.photographer.findUnique({
                where: {
                    email: session.user.email
                }
            })
            prisma.$disconnect()

            return {
                props: {
                    photo,
                    photographer,
                    session: session.user.email
                }
            }
        }
        else {
            return {
                props: {
                    photo,
                    photographer,

                }
            }
        }

    } catch (error) {
        console.log(error)
    }


}
