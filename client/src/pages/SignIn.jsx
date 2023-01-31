import React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom"
import { useEffect,useState,} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserAuth } from '../context/userAuthContext';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { selectedUser, setUsers } from '../redux/actions/userActions';
import api from '../api/index'
function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Bug Tracker
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

const searchForMember=(uid,users)=>{
  for (let i=0;i<users.length;i++){
    if (users[i].uid===uid){
      return users[i]
    }
  }
  return false
}

const theme = createTheme();

const SignIn =()=>{
  const {user} = useUserAuth()
  const users =useSelector((state)=>state.allUsers.users)
  const dispatch=useDispatch()
  const findUserWithUID=async(user,users)=>{
    for(let i=0;i<users.length;i++){
      if(users[i].uid===user.uid){
        dispatch(selectedUser(users[i]))
        return ''
      }
    }
    const newUser = {email:user.email,uid:user.uid}
    const createdUser =await api.users.createUser(newUser)
    dispatch(selectedUser(createdUser))
    const updatedUsers=await api.users.fetchUsers()
    dispatch(setUsers(updatedUsers))
  }
  
  const [formInputData,setFormInputData]=useState({
    email:'',
    password:''
  })
  
  const {logIn,googleSignIn}=useUserAuth()
  const [error,setError]=useState('')
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('')
    try { 
      await logIn(formInputData.email,formInputData.password)

      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }
  useEffect(()=>{
    if(user){
      findUserWithUID(user,users)
      navigate('/')
  }
  },[user])
  const handleChange=(e)=>{
    const inputFieldName=e.target.id
    const inputFieldValue=e.target.value
    const newInputValue={...formInputData}
    newInputValue[inputFieldName]=inputFieldValue
    setFormInputData(newInputValue)
  }
  const SignInAsDemoDeveloper=async()=>{
    setError('')
    try {
      const demoDeveloperPassword = process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD
      const demoDeveloperEmail = process.env.REACT_APP_DEMO_DEVELOPER_EMAIL
      const result = await logIn(demoDeveloperEmail,demoDeveloperPassword)
      const currentUser = searchForMember(result.user.uid,users)
      dispatch(selectedUser(currentUser))
      navigate('/')
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }
  const SignInAsDemoAdmin=async()=>{
    setError('')
      try{
          const demoAdminPassword = process.env.REACT_APP_DEMO_ADMIN_PASSWORD
          const demoAdminEmail = process.env.REACT_APP_DEMO_ADMIN_EMAIL
          const result =await logIn(demoAdminEmail,demoAdminPassword)
          const currentUser = searchForMember(result.user.uid,users)
          dispatch(selectedUser(currentUser))
          navigate('/')
      }catch(error){
        console.log(error)
      setError(error)
      }
  }
  //sign in with google
  const GoogleLogin = async(e)=>{
    setError('')
    try{
      const result = await googleSignIn()
      findUserWithUID(result.user,users)
      navigate(`/`)
    }catch(error){
      setError(error.message)
    }
}
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'white', border:"2px solid #1976d2" }}>
            <LockOutlinedIcon  color='primary'/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Button
                onClick={SignInAsDemoDeveloper}
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                >Log In as demo developer
              </Button>
              <Button
                onClick={SignInAsDemoAdmin}
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                >Log In as demo admin
              </Button>
            {error && <Alert variant='filled' color='error'>{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
          </Box>
          <Button
              onClick={GoogleLogin}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login with Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotpassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )}

  export default SignIn