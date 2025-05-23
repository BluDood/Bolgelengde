import React, { useContext } from 'react'
import styles from './Titlebar.module.css'
import { Link, useNavigate } from 'react-router'
import { UserContext } from '../../contexts/UserContext.tsx'

const Titlebar: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const actions = [
    { icon: 'music_note', action: () => navigate('/songs') },
    { icon: 'add', action: () => navigate('/songs/new'), admin: true },
    {
      icon: 'library_music',
      action: () => navigate('/playlists')
    },
    { icon: 'person', action: () => navigate('/me') },
    {
      icon: 'logout',
      color: 'red',
      action: () => {
        if (!confirm('Are you sure you want to log out?')) return
        localStorage.removeItem('token')
        navigate('/')
      }
    }
  ]

  return (
    <div className={styles.titlebar}>
      <Link to="/" className={styles.logo}>
        <span className="material-icons">graphic_eq</span> Bølgelengde
      </Link>
      <div className={styles.actions}>
        {actions.map((action, i) => {
          if (action.admin && user?.type !== 'admin') return null
          return (
            <button
              key={i}
              onClick={action.action}
              data-color={action.color}
            >
              <span className="material-icons">{action.icon}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Titlebar
