import React from 'react';
import {Button as HeroButton} from "@heroui/react";

interface ButtonProps {
  text: string;
  type: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({text, type}) => {
  return (
    <HeroButton color={type} size="lg" className="w-full">
      {text}
    </HeroButton>
  );
};

export default Button;
