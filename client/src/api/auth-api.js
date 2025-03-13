import axios from 'axios';
axios.defaults.withCredentials = true;

export async function onSignup(signupData) {
  return await axios.post(
    'http://localhost:6001/api/signup',
    signupData
  )
}

export async function onLogin(loginData) {
  return await axios.post('http://localhost:6001/api/login', loginData)
}

export async function onLogout() {
  return await axios.get('http://localhost:6001/api/logout')
}

export async function fetchProtectedInfo() {
  return await axios.get('http://localhost:6001/api/protected')
}