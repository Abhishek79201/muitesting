'use client'

import React, { useState } from 'react'
import { Form, Input, Button, message, Divider } from 'antd'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '../hooks/hooks'
import { signUp } from '@/redux/slices/authSlice'

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: {
    name: string
    email: string
    password: string
  }) => {
    setLoading(true)
    try {
      console.log(values)
      await dispatch(signUp(values)).unwrap()
      message.success('Sign up successful!')
      router.push('/signin')
    } catch (error) {
      message.error('Sign up failed, please try again.')
    }
    setLoading(false)
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold text-center mb-6'>Sign Up</h3>
        <Form
          name='signup'
          layout='vertical'
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              placeholder='Enter your name'
              className='border border-gray-300 rounded-md'
            />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email' }
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
              Sign Up
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button
              loading={loading}
              className='w-full'
              onClick={() => router.push('/signin')}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default SignUp
