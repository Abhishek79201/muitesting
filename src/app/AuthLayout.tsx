/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const token = Cookies.get('Authorization')

  useEffect(() => {
    if (!token) {
      router.replace('/signin')
      return
    }
  }, [token])

  return <div>{children}</div>
}

export default AuthLayout
