import React, { useContext, useEffect } from 'react'
import styles from './Register.module.css'
import { Link, useNavigate } from 'react-router'
import { instance } from '../../lib/api.ts'
import { UserContext } from '../../contexts/UserContext.tsx'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const passwordConfRef = React.useRef<HTMLInputElement>(null)

  async function register() {
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    const passwordConf = passwordConfRef.current?.value
    if (!username || !password || !passwordConf) {
      return alert('Please fill in all fields')
    }

    if (password !== passwordConf) {
      return alert('Passwords do not match')
    }

    const res = await instance.post('/auth/register', {
      username,
      password
    })

    if (res.status !== 200) {
      if (res.status === 409) {
        return alert('Username already exists')
      } else {
        return alert('Invalid username or password')
      }
    } else {
      setUser(res.data.user)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    }
  }

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  return (
    <div className={styles.wrapper}>
      <div className={styles.register}>
        <h1>Register</h1>
        <div className={styles.inputs}>
          <input
            ref={usernameRef}
            type="text"
            placeholder="Username"
            onKeyDown={e => e.key === 'Enter' && register()}
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            onKeyDown={e => e.key === 'Enter' && register()}
          />
          <input
            ref={passwordConfRef}
            type="password"
            placeholder="Confirm Password"
            onKeyDown={e => e.key === 'Enter' && register()}
          />
        </div>
        <Link to="/auth/login">Already have an account?</Link>
        <button onClick={register}>Register</button>
      </div>
    </div>
  )
}

export default Register
