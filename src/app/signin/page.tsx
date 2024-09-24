'use client'
import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Divider,
  Typography,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material'
import { login, selectToken } from '@/redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { useRouter } from 'next/navigation'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectToken)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    }
    setLoading(true)
    dispatch(login(values))
    setLoading(false)
  }

  if (session) return null

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height='100vh'
    >
      <Box
        component='form'
        onSubmit={handleSubmit}
        width='100%'
        maxWidth={400}
        p={3}
        boxShadow={3}
        borderRadius={2}
        bgcolor='white'
      >
        <Typography variant='h4' component='h3' textAlign='center' mb={3}>
          Sign In
        </Typography>
        <TextField
          label='Email'
          name='email'
          type='email'
          fullWidth
          margin='normal'
          required
        />
        <TextField
          label='Password'
          name='password'
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin='normal'
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          Sign In
        </Button>
        <Divider sx={{ my: 3 }} />
        <Button
          variant='outlined'
          fullWidth
          onClick={() => router.push('/signup')}
          disabled={loading}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  )
}

export default SignIn
