import React from 'react';
import LoginForm from '../molecules/LoginForm';
import Image from '../atoms/Image';
import Divider from '../atoms/Divider';

interface LoginSectionProps {
  logoSrc: string;
}

const LoginSection: React.FC<LoginSectionProps> = ({logoSrc}) => {
  return (
    <div className='flex flex-row items-center justify-center w-[700px]'>
      <div className='aspect-square w-1/2'>
        <Image src={logoSrc} alt="Logo"/>
      </div>
      <div className='mr-8'>
        <Divider orientation='vertical' color='colorLogo'/>
      </div>
      <LoginForm title="Iniciar sesión a" subtitle='Rotana'/>
    </div>
  );
};

export default LoginSection;
