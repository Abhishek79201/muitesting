/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { CircularProgress } from '@mui/material'
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
  const token = Cookies.get('Authorization')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile())
    }
  }, [token])

  if (loading === true) {
    return (
      <div className='flex screen items-center justify-center min-h-screen'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <AuthLayout>
      <main>
        {user ? (
          <Tasks />
        ) : (
          <div className='flex min-h-screen items-center justify-center'>
            <CircularProgress />
          </div>
        )}
      </main>
    </AuthLayout>
  )
}
