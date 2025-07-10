import React from 'react';

interface VideoProps {
  src: string;
}

const Video: React.FC<VideoProps> = ({src}) => {
  return (
    <div className='w-full h-full'>
      <video 
        src={src} 
        autoPlay 
        muted 
        loop 
        playsInline
        className='w-full h-full object-cover'
        controls={false}
      />
    </div>
  );
};

export default Video;
