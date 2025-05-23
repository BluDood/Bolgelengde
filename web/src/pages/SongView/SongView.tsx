import React, { useContext, useEffect, useState } from 'react'
import styles from './SongView.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'
import { UserContext } from '../../contexts/UserContext.tsx'

const SongView: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()

  const [song, setSong] = useState<Song | null>(null)
  // bruker-context hentes, brukes for å sjekke om bruker er admin og vise knapper for oppdatering og sletting
  const { user } = useContext(UserContext)

  async function deleteSong() {
    // bekreftelse før sletting
    if (!confirm('Are you sure you want to delete this song?')) return
    const res = await instance.delete(`/songs/${params.id}`)

    if (res.status === 200) {
      // naviger tilbake til sanglisten
      navigate('/songs')
    } else {
      console.error('Failed to delete song')
    }
  }

  useEffect(() => {
    // hent sang
    async function fetchSong() {
      const song = await instance.get(`/songs/${params.id}`)

      if (song.status === 200) {
        setSong(song.data)
      } else {
        if (song.status === 404) {
          alert('Song not found!')
          navigate('/songs')
        } else {
          alert('Failed to fetch song')
        }
      }
    }

    fetchSong()
  }, [params.id, navigate])

  return song ? (
    <div className={styles.song}>
      <div className={styles.header}>
        {user?.type === 'admin' ? (
          <div className={styles.actions}>
            <button
              data-type="save"
              onClick={() => navigate(`/songs/${params.id}/edit`)}
            >
              <span className="material-icons">edit</span>
            </button>
            <button data-type="delete" onClick={deleteSong}>
              <span className="material-icons"> delete </span>
            </button>
          </div>
        ) : null}
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
