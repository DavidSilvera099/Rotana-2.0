import React from 'react';
import {Button as HeroButton} from "@heroui/react";

interface ButtonProps {
  text: string;
  type: "primary" | "secondary";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  buttonType?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({text, type, onClick, loading, disabled, buttonType = "button"}) => {
  return (
    <HeroButton 
      color={type} 
      size="lg" 
      className="w-full"
      onClick={onClick}
      isLoading={loading}
      isDisabled={disabled}
      type={buttonType}
    >
      {text}
    </HeroButton>
  );
};

export default Button;
