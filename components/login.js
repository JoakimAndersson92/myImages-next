import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export default function LoginPage() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div>
                <p className="text-gray-300">Welcome, {session.user.name || session.user.email}</p>
                {/* {session.user.image &&
                <Image src={`/${session.user.image}`} alt="Image of user" width={100} height={100} />
                } */}
                
                <button className="text-gray-300" onClick={() => signOut({callbackUrl: `${window.location.origin}`})}>Sign out</button>
            </div>
        )
    }
    else {
        return (
            <div>
                <p className="text-gray-300">You are not signed in</p>
                <button className="text-gray-300" onClick={() => signIn()}>Sign in</button>
            </div>
        )
    }

}
