"use client"

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import React from 'react'

const DashboardPage = () => {
  const {theme, setTheme} = useTheme()

  return (


    <div className='w-full h-full'>
      Testing
    </div>
  )
}

export default DashboardPage