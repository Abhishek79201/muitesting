'use client' // Mark this as a client-side component
import Link from 'next/link'
import { Spin } from 'antd'
import { useAppDispatch, useAppSelector } from './hooks/hooks'
import {
  fetchProfile,
  selectLoading,
  selectUser
} from '@/redux/slices/authSlice'
import AuthLayout from './AuthLayout'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import Tasks from './tasks/Tasks'

export default function Home () {
  const user = useAppSelector(selectUser)
  const loading = useAppSelector(selectLoading)
  const token = Cookies.get('Authorization') // Retrieve token from cookies
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchProfile())
  }, [token])
  if (loading === true) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spin />
      </div>
    )
  }

  return (
    <AuthLayout>
      <main className=''>
        {user ? (
          <Tasks />
        ) : (
          <div className='flex min-h-screen items-center justify-center '>
            <Spin />
          </div>
        )}
      </main>
    </AuthLayout>
  )
}
