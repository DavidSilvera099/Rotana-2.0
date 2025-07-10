import React from 'react';
import {Image as HeroImage} from "@heroui/react";

interface ImageProps {
  src: string;
  alt: string;
}

const Image: React.FC<ImageProps> = ({src, alt}) => {

  return (
    <div className='w-full h-full'>
      <HeroImage src={src} alt={alt} loading='lazy' />
    </div>
  );
};

export default Image;
