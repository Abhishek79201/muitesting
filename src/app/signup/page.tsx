
'use client'

import React, { useState } from 'react'
import { TextField, Button, Divider, Typography, Box, Alert, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '../hooks/hooks'
import { signUp } from '@/redux/slices/authSlice'

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
    
    setLoading(true)
    try {
      await dispatch(signUp(values)).unwrap()
      setAlert({ type: 'success', message: 'Sign up successful!' })
      router.push('/signin')
    } catch (error) {
      setAlert({ type: 'error', message: 'Sign up failed, please try again.' })
    }
    setLoading(false)
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box
        component="form"
        onSubmit={handleSubmit}
        width="100%"
        maxWidth={400}
        p={3}
        boxShadow={3}
        borderRadius={2}
        bgcolor="white"
      >
        <Typography variant="h4" component="h3" textAlign="center" mb={3}>
          Sign Up
        </Typography>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          Sign Up
        </Button>
        <Divider sx={{ my: 3 }} />
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push('/signin')}
          disabled={loading}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  )
}

export default SignUp
