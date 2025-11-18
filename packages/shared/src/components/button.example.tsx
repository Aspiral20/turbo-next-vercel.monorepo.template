"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  className = '', 
  onClick,
  type = 'button'
}: ButtonProps) {
  return (
    <button 
      type={type}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}