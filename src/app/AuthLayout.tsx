'use client'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const token = Cookies.get('Authorization') // Retrieve token from cookies

  useEffect(() => {
    if (!token) {
      router.replace('/signin')
      return
    }
  }, [token]) // Add dispatch to the dependency array

  return <div>{children}</div>
}

export default AuthLayout
