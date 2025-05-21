import React from 'react'
import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router'
import { instance } from '../../lib/api.ts'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  async function login() {
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    if (!username || !password) {
      return alert('Please fill in all fields')
    }

    const res = await instance.post('/auth/login', {
      username,
      password
    })

    if (res.status !== 200) {
      return alert('Invalid username or password')
    } else {
      localStorage.setItem('token', res.data.token)
      navigate('/')
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.login}>
        <h1>Sign in</h1>
        <div className={styles.inputs}>
          <input ref={usernameRef} type="text" placeholder="Username" />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
          />
        </div>
        <Link to="/auth/register">Don't have an account?</Link>
        <button onClick={login}>Login</button>
      </div>
    </div>
  )
}

export default Login
