import { Crop } from "react-image-crop"

const getCroppedImg = (imageURL: string, pixelCrop: Crop) => {
  const canvas = document.createElement("canvas")
  const image = new Image()
  const promise = new Promise<void>((resolve) => {
    image.onload = () => {
      canvas.width = (pixelCrop.width * image.width) / 100
      canvas.height = (pixelCrop.height * image.height) / 100
      const ctx = canvas.getContext("2d")

      ctx.drawImage(
        image,
        (pixelCrop.x * image.width) / 100,
        (pixelCrop.y * image.height) / 100,
        (pixelCrop.width * image.width) / 100,
        (pixelCrop.height * image.height) / 100,
        0,
        0,
        (pixelCrop.width * image.width) / 100,
        (pixelCrop.height * image.height) / 100,
      )
      resolve()
    }
    image.src = imageURL
  }).then(
    () =>
      new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, "image/jpeg")
      }),
  )
  return promise
}

export default getCroppedImg
