import React, { useEffect, useState } from 'react'
import styles from './SongView.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const SongView: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [song, setSong] = useState<Song | null>(null)

  async function updateSong() {
    const song = await instance.get(`/songs/${params.id}`)

    if (song.status === 200) {
      setSong(song.data)
    } else {
      console.error('Failed to fetch song')
    }
  }

  useEffect(() => {
    updateSong()
  }, [])

  return song ? (
    <div className={styles.song}>
      <div className={styles.header}>
        <div className={styles.cover}>
          <span className="material-icons">album</span>
        </div>
        <div className={styles.info}>
          <h1>{song.title}</h1>
          <p>{song.artist}</p>
          <p className={styles.details}>
            {song.genre} • {song.vibes.join(', ')}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default SongView
