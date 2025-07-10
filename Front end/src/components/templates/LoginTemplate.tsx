import React from 'react';
import LoginSection from '../organisms/LoginSection';
import VideoBanner from '../../assets/Video-banner.mp4';
import Video from '../atoms/Video.tsx'

interface LoginTemplateProps {
  logoSrc: string;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({logoSrc}) => {
  return (
    <div className='flex w-full h-screen justify-center items-center overflow-hidden gap-12'>
      <div className='w-5/6 h-full flex items-start mt-64 justify-end'>
        <LoginSection logoSrc={logoSrc}/>
      </div>
      <div className='bg-blue-500 w-[35vw] h-full text-secondary'>
        <Video src={VideoBanner}/>
      </div>
    </div>
  );
};

export default LoginTemplate;
