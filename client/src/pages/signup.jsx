import { useState } from 'react'
import { onSignup } from '../api/auth-api'
import Layout from '../components/layout'

const Signup = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await onSignup(values);
            console.log(response);

            setError('')
            setSuccess(response.data.message)
            setValues({ username: '', email: '', password: '' })
        } catch (error) {
            setError(error.response.data.errors[0].msg)
            setSuccess('')
        }
    }

    return (
        <Layout>
            <form onSubmit={(e) => onSubmit(e)} className='container mt-3'>
                <h1>Register</h1>

                <div className='mb-3'>
                    <label htmlFor='username' className='form-label'>
                        Username
                    </label>
                    <input
                        onChange={(e) => onChange(e)}
                        type='username'
                        className='form-control'
                        id='username'
                        name='username'
                        value={values.username}
                        placeholder='username'
                        required
                    />
                </div>

                <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                        Email address
                    </label>
                    <input
                        onChange={(e) => onChange(e)}
                        type='email'
                        className='form-control'
                        id='email'
                        name='email'
                        value={values.email}
                        placeholder='test@gmail.com'
                        required
                    />
                </div>

                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                        Password
                    </label>
                    <input
                        onChange={(e) => onChange(e)}
                        type='password'
                        value={values.password}
                        className='form-control'
                        id='password'
                        name='password'
                        placeholder='passwod'
                    />
                </div>

                <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>
                <div style={{ color: 'green', margin: '10px 0' }}>{success}</div>

                <button type='submit' className='btn btn-primary'>
                    Submit
                </button>
            </form>
        </Layout>
    )
}

export default Signup;