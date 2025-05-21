import React from 'react'
import styles from './Titlebar.module.css'
import { Link, useNavigate } from 'react-router'

const actions = [
  { icon: 'add', href: '/songs/new' },
  { icon: 'person', href: '/me' }
]

const Titlebar: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.titlebar}>
      <Link to="/" className={styles.logo}>
        <span className="material-icons">graphic_eq</span> Bølgelengde
      </Link>
      <div className={styles.actions}>
        {actions.map((action, i) => (
          <button key={i} onClick={() => navigate(action.href)}>
            <span className="material-icons">{action.icon}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Titlebar
