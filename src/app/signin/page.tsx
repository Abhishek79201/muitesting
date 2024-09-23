'use client'

import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Divider } from 'antd'
import { login, selectToken } from '@/redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { useRouter } from 'next/navigation'

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectToken)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    dispatch(login(values))
    setLoading(false)
  }

  if (session) return null

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold text-center mb-6'>Sign In</h3>
        <Form
          name='signin'
          layout='vertical'
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Enter a valid email!' }
            ]}
          >
            <Input
              placeholder='Enter your email'
              className='border border-gray-300 rounded-md'
            />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder='Enter your password'
              className='border border-gray-300 rounded-md'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              className='w-full'
            >
              Sign In
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button
              loading={loading}
              className='w-full'
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default SignIn
