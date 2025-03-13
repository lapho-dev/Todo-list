import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { onLogout } from '../api/auth-api'
import { unauthenticateUser } from '../redux/slices/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state) => state.auth)

  const logout = async () => {
    try {
      await onLogout()

      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <nav className='navbar navbar-light bg-light'>
      <div className='container'>
        <div>
          <NavLink to='/'>
            <span className='navbar-brand mb-0 h1'>Home</span>
          </NavLink>
        </div>

        {isAuth ? (
          <div>
            <NavLink to='/dashboard' className='mx-3'>
              <span>Dashboard</span>
            </NavLink>

            <button onClick={() => logout()} className='btn btn-primary'>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <NavLink to='/login'>
              <span>Login</span>
            </NavLink>

            <NavLink to='/signup' className='mx-3'>
              <span>Signup</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar