import React from 'react';
import { ToastContainer } from 'react-toastify';

function AuthLayout({ children }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

export default AuthLayout;
