import React from 'react';
import {Image as HeroImage} from "@heroui/react";

interface ImageProps {
  src: string;
  alt: string;
}

const Image: React.FC<ImageProps> = ({src, alt}) => {

  return (
    <div>
      <HeroImage src={src} alt={alt} />
    </div>
  );
};

export default Image;
