import React, { useState, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CropperProps {
  src: string | ArrayBuffer | null;
  croppedSrc: string | ArrayBuffer | null;
  setCroppedSrc: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null>
  >;
}

type Crop = {
  aspect: number;
  unit: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const Cropper: React.FC<CropperProps> = (props) => {
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState<Crop>({
    aspect: 9 / 16,
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const makeClientCrop = (crop) => {
    if (imgRef && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef, crop);
      props.setCroppedSrc(croppedImageUrl);
    }
  };

  const getCroppedImg = (image: any, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return canvas.toDataURL("image/jpeg");
  };

  makeClientCrop(crop);

  return (
    <ReactCrop
      src={props.src}
      onImageLoaded={onLoad}
      crop={crop}
      onChange={(c: Crop) => setCrop(c)}
      onComplete={makeClientCrop}
    />
  );
};

export default Cropper;
