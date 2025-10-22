import Image from 'next/image'
import React from 'react'

export default function Footer() {
  return (
    <div>
      <Image 
        src={'/company-logo.svg'}
        alt='Company Logo'
        width={75}
        height={50}
      />
    </div>
  )
}
