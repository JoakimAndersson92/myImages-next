import Image from "next/image";
import Link from "next/link";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { storage } from "./firebase";
import ErrorBoundary from "./errorBoundery";

export function ShowPhotographerImage(photographer) {
  const [imageList, setImageList] = useState([])
  const imageListRef = ref(storage, `${photographer}`);



  useEffect(() => {
    listAll(imageListRef).then((res) => {
      const promises = res.items.map((item) => getDownloadURL(item));
      Promise.all(promises).then((urls) => {
        setImageList(urls);
      });
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imageList.map((url) => {

          return (
            <Link key={crypto.randomUUID()} href={`/images/viewimage?img=${encodeURIComponent(url)}`}>
              <div className="group relative h-60">
                <Image
                  src={url}
                  alt="image"
                  fill={true}
                  className="object-cover w-full"
                  sizes="(max-width: 768px)"
                />
              </div>
            </Link>
          )
        })}
      </div>
    </ErrorBoundary>
  )
}


export default function ShowImagesNext({ photos }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const filepaths = photos.map(photo => photo.filepath);

    async function fetchImages() {
      const response = await fetch('/api/images/getImages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paths: filepaths }),

      });

      if (response.ok) {
        const imagesBase64 = await response.json();
        const urls = filepaths.map(filepath => {
          const base64 = imagesBase64[filepath];
          if (base64) {
            return `data:image/png;base64,${base64}`; // Assuming all images are PNGs.
          }
          return null;
        }).filter(Boolean);
        setImages(urls);
      } else {
        console.error('Failed to fetch images.');
      }
    }

    fetchImages();
  }, [photos]);
  if (images.length === 0) return <p>Loading...</p>;

  return (
    <ErrorBoundary>
      <div className="w-full p-5 pb-10 mx-auto mb-10 gap-5 columns-1 md:columns-2 lg:columns-3 space-y-5 bg-custom-grey">
        {photos.map((photoObj, index) => {
          return (
            <Link key={index} href={`/images/viewimage?img=${encodeURIComponent(photoObj.filepath)}&folderpath=${photoObj.folderpath}`}>
              <Image
                src={images[index]}
                alt="image"
                width={photoObj.width}
                height={photoObj.height}
                className="my-5"
              />
            </Link>
          );
        })}
      </div>
    </ErrorBoundary>
  )
}
