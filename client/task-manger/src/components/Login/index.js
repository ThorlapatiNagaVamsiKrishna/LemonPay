import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  Typography,
  Box,
  FormControlLabel
} from "@mui/material";
import './index.css'

const Login = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [userLoginData, setUserLoginData] = useState({ email: '', password: '' })
  const [validatePassword, setValidatePassword] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [userRegisterData, setUserRegisterData] = useState({ name: '', email: '', password: '' })
  const [resetPasswordData, setResetPasswordData] = useState({ email: '', password: '', confirmPassword: '' })

  const handleOpenChangePassword = () => setChangePasswordOpen(true)
  const handleCloseChangePassword = () => setChangePasswordOpen(false)
  const handleOpenRegister = () => setRegisterOpen(true);
  const handleCloseRegister = () => setRegisterOpen(false);
  const navigate = useNavigate()

  const handleShowPassword = () => {
    setShowPassword(true)
  }

  const handleUserLogin = (e) => {
    const { name, value } = e.target
    setUserLoginData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleUserRegister = (e) => {
    const { name, value } = e.target
    setUserRegisterData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleResetPassword = (e) => {
    const { name, value } = e.target
    setResetPasswordData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestConfig = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLoginData)
      }
      const data = await fetch('http://localhost:4000/user/login', requestConfig)
      const response = await data.json()
      console.log(response)
      if (response.jwtToken !== undefined) {
        Cookie.set('jwtToken', response.jwtToken, { expires: 1 })
        navigate('/taskManager')
        setUserLoginData({ email: '', password: '' })
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userRegisterData.password.length < 8) {
        setValidatePassword('Min password length 8')
      }
      else {
        const requestConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userRegisterData)
        };
        const data = await fetch('http://localhost:4000/user/register', requestConfig)
        const response = await data.json()
        console.log(response)
        setUserRegisterData({ name: '', email: '', password: '' })
        setRegisterOpen(false)
        setValidatePassword(null)
      }
    }
    catch (e) {
      console.log(e.message)
    }

  }

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    try {
      if (resetPasswordData.password.length < 8) {
        setValidatePassword('Min password length 8')
      }
      else if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
        setValidatePassword('Password Mis-Match')
      }
      else {
        const requestConfig = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resetPasswordData)
        }
        const data = await fetch('http://localhost:4000/user/reset', requestConfig)
        const response = await data.json()
        console.log(response)
        setResetPasswordData({ email: '', password: '', confirmPassword: '' })
        setRegisterOpen(false)
        setValidatePassword(null)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const resetPasswordPopup = () => {
    return (
      <Dialog open={changePasswordOpen} onClose={handleCloseChangePassword}>
        <DialogTitle className='login-heading'>Welcome Reset Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePasswordResetSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              placeholder="mahadev@lemonpay.tech"
              margin="normal"
              onChange={handleResetPassword}
              value={resetPasswordData.email}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              placeholder="Min 8 characters"
              margin="normal"
              onChange={handleResetPassword}
              value={resetPasswordData.password}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Re-enter Password"
              name="confirmPassword"
              placeholder="Enter New Password"
              margin="normal"
              onChange={handleResetPassword}
              value={resetPasswordData.confirmPassword}
              error={validatePassword}
              helperText={validatePassword}
              required
            />
            <DialogActions>
              <Button onClick={handleCloseChangePassword} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Reset Password
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const renderRegisterUser = () => {
    return (
      <>
        <Dialog open={registerOpen} onClose={handleCloseRegister}>
          <DialogTitle className='login-heading'>Welcome User Registration</DialogTitle>
          <DialogContent>
            <form onSubmit={handleRegisterSubmit}>
              <TextField
                label="Name"
                fullWidth
                margin="dense"
                required
                name='name'
                onChange={handleUserRegister}
                value={userRegisterData.name}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="dense"
                required
                name='email'
                value={userRegisterData.email}
                onChange={handleUserRegister}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="dense"
                required
                name='password'
                value={userRegisterData.password}
                onChange={handleUserRegister}
                error={validatePassword}
                helperText={validatePassword}
              />
              <DialogActions>
                <Button onClick={handleCloseRegister} color="secondary">
                  Cancel
                </Button>
                <Button variant="contained" color="primary" type='submit'>
                  Sign Up
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className='login-container'>
      <div className='main-content-container'>
        <Typography variant='h4' className='main-heading'>Join 8 Million Businesses <br />
          <Typography variant='span' className='main-heading-span'>Powering Growth with</Typography><br />
          Lemonpay!
        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleLoginSubmit}
        className='form-container'
        sx={{ mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}
      >
        <Typography variant="h6" className='login-heading' sx={{ textAlign: "center", mb: 2 }}>
          Welcome Login System
        </Typography>
        <TextField
          fullWidth
          label="Email"
          type="email"
          name='email'
          placeholder="mahadev@lemonpay.tech"
          margin="normal"
          onChange={handleUserLogin}
          value={userLoginData.email}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name='password'
          placeholder="Min 8 characters"
          margin="normal"
          onChange={handleUserLogin}
          value={userLoginData.password}
          required
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <FormControlLabel control={<Checkbox onClick={handleShowPassword} value={showPassword} />} label="Remember me" />
          <Button variant="text" color="secondary" onClick={handleOpenChangePassword}>
            Forget password?
          </Button>
        </Box>
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type='submit'>
          Sign in
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleOpenRegister}
        >
          If You Don't Have an Account? Register Here
        </Button>
      </Box>
      {renderRegisterUser()}
      {resetPasswordPopup()}
    </div >
  )
}


export default Login