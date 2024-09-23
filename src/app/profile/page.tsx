// pages/profile.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { fetchProfile, updateProfile } from '@/redux/slices/authSlice'

const Profile: React.FC = () => {
  const dispatch = useAppDispatch()
  const { name, email } = useAppSelector(state => state.user)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   dispatch(fetchProfile())
  // }, [dispatch])

  const handleSubmit = async (values: { name: string; email: string }) => {
    setLoading(true)
    try {
      await dispatch(updateProfile(values)).unwrap()
      message.success('Profile updated successfully!')
    } catch (error) {
      message.error('Profile update failed.')
    }
    setLoading(false)
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold text-center mb-6'>Profile</h3>
        <Form
          name='profile'
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{ name, email }}
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

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              className='w-full'
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Profile
