"use client"

import Image from "next/image"

interface TonLogoProps {
  size?: number
  className?: string
}

export function TonLogo({ size = 20, className = "" }: TonLogoProps) {
  return (
    <Image
      src="https://assets.pepecase.app/assets/ton1.png"
      alt="TON"
      width={size}
      height={size}
      className={`inline-block ${className}`}
    />
  )
}
