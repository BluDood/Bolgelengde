import React, { useContext, useEffect, useState } from 'react'
import styles from './PlaylistView.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'
import { UserContext } from '../../contexts/UserContext.tsx'

const PlaylistView: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()

  const [playlist, setPlaylist] = useState<PlaylistWithSongs | null>(null)
  const { user } = useContext(UserContext)

  async function deletePlaylist() {
    // bekreftelse før sletting
    if (!confirm('Are you sure you want to delete this playlist?')) return
    const res = await instance.delete(`/playlists/${params.id}`)

    if (res.status === 204) {
      // naviger tilbake til sanglisten
      navigate('/playlists')
    } else {
      console.error('Failed to delete playlist')
    }
  }

  useEffect(() => {
    async function updatePlaylist() {
      // hent spilleliste
      const playlist = await instance.get(`/playlists/${params.id}`)

      if (playlist.status === 200) {
        setPlaylist(playlist.data)
      } else {
        if (playlist.status === 404) {
          alert('Playlist not found!')
          navigate('/playlists')
        } else {
          alert('Failed to fetch playlist')
        }
      }
    }

    updatePlaylist()
  }, [params.id, navigate])

  return playlist ? (
    <div className={styles.playlist}>
      <div className={styles.header}>
        {user?.type === 'admin' ? (
          <div className={styles.actions}>
            <button
              data-type="save"
              onClick={() => navigate(`/playlists/${params.id}/edit`)}
            >
              <span className="material-icons">edit</span>
            </button>
            <button data-type="delete" onClick={deletePlaylist}>
              <span className="material-icons"> delete </span>
            </button>
          </div>
        ) : null}
        <div className={styles.cover}>
          <span className="material-icons">library_music</span>
        </div>
        <div className={styles.info}>
          <h1>{playlist.name}</h1>
          <p>
            {playlist.songs.length} song
            {playlist.songs.length === 1 ? '' : 's'}
          </p>
          <p className={styles.details}>{playlist.occasions.join(', ')}</p>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <span className="material-icons">music_note</span> Title
            </th>
            <th>
              <span className="material-icons">person</span> Artist
            </th>
            <th>
              <span className="material-icons">category</span> Genre
            </th>
            <th>
              <span className="material-icons">emoji_objects</span> Vibes
            </th>
          </tr>
        </thead>
        <tbody>
          {playlist.songs &&
            playlist.songs.map((song: Song) => (
              <tr
                key={song.id}
                onClick={() => navigate(`/songs/${song.id}`)}
              >
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.genre}</td>
                <td>{song.vibes.join(', ')}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default PlaylistView
