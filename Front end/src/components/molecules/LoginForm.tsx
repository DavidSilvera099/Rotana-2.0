import React from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

interface LoginFormProps {
  title: string;
  subtitle: string;
}

const LoginForm: React.FC<LoginFormProps> = ({title, subtitle}) => {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div>
        <h1 className='text-colorLogo text-sm'>{title}</h1>
        <p className='text-colorLogo text-4xl'>{subtitle}</p>
      </div>
      <Input label="Email" type="email" />
      <Button text="Login" type="secondary" />
    </div>
  );
};

export default LoginForm;
