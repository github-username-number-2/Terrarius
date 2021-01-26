export default function loadImage(imageURL) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = imageURL;
  });
}