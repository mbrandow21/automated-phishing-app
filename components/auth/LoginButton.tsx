"use client"
import React from 'react'

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  children: React.ReactNode,
  mode?: "modal" | "redirect",
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild
}: LoginButtonProps) => {
  const onClick = () => {
    router.push("/auth/login")
  }
  const router = useRouter();

  if (mode === "modal") {
    return (
      <span>
        TODO: Implement Modal
      </span>
    )
  }
  return (
    <span onClick={() => onClick()} className="cursor-pointer">
      {children}
    </span>
  )
}

export default LoginButton