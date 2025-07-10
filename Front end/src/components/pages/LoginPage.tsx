import React from 'react';

interface LoginPageProps {
  // Props
  propTest: React.ReactNode;
}

const LoginPage: React.FC<LoginPageProps> = ({propTest}) => {
  return (
    <div>
      {propTest}
    </div>
  );
};

export default LoginPage;
