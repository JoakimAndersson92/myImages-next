import { storage } from "@/components/firebase";
import { ref, uploadBytes, getDownloadURL, list } from "firebase/storage";
import { v4 } from "uuid";
import { useState } from "react"
import UploadProfilePicture from "./uploadProfilePicture";

export default function UploadImage({ userdata }) {
    const [imageUpload, setImageUpload] = useState()


    const uploadImage = async () => {
        if (imageUpload == null) return;
        const imageName = imageUpload.name + v4();

        const imageRefUser = ref(storage, `${userdata.personID}/${imageName}`);
        const imageRef = ref(storage, `${imageName}`);

        try {
            // Upload to user-specific directory
            await uploadBytes(imageRefUser, imageUpload);

            // Upload to general directory
            await uploadBytes(imageRef, imageUpload);

            // Get the download URL
            const url = await getDownloadURL(imageRef);
            const urlUser = await getDownloadURL(imageRefUser);

            // Pass URL to uploadData function
            uploadImageData(url, urlUser);
            window.alert("image uploaded");

        } catch (error) {

            console.error("Error uploading image: ", error);
        }
    };
    const uploadImageData = async (imageUrl, imageUrlUser) => {
        const fileName = imageUpload.name + v4();
        const photoInformation = {
            personID: userdata.personID,
            filename: fileName,
            filetype: imageUpload.type,
            filesize: imageUpload.size,
            url: imageUrl,
            urlUser: imageUrlUser
        }

        const res = await fetch('../../api/images/storeImages', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(photoInformation)
        })
    }

    return (

        
        <div>
            <UploadProfilePicture userdata={userdata} />
            <h1 className="text-center text-4xl font-semibold text-gray-900 mt-12 mb-6 dark:text-white">Upload a photo</h1>
            <div className="max-w-5xl mx-auto mt-12">
                <div className="flex flex-col items-center space-y-6">
                    {/* Drop zone */}
                    <div
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = e.dataTransfer.files;
                            if (files.length) {
                                setImageUpload(files[0]);
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex justify-center items-center w-60 h-60 border-dotted border-4 border-gray-400 hover:border-gray-600 cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
                    >
                        <p className="text-gray-800 text-center dark:text-gray-300">{imageUpload ? imageUpload.name : "Drop image here"}</p>
                    </div>

                    {/* File Input */}
                    <input
                        onChange={(e) => { setImageUpload(e.target.files[0]) }}
                        className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        aria-describedby="user_avatar_help"
                        id="user_avatar"
                        type="file"
                    />

                    {/* Upload Button */}
                    <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={uploadImage}
                    >
                        Ladda upp bild
                    </button>
                </div>
            </div>
        </div>
    )
}
