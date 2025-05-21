import React, { useEffect, useRef, useState } from 'react'
import styles from './Songs.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const Songs: React.FC = () => {
  const navigate = useNavigate()
  const [songs, setSongs] = useState<Song[] | null>(null)
  const queryRef = useRef<HTMLInputElement>(null)

  async function updateSongs() {
    setSongs(null)
    const query = queryRef.current?.value
    if (query) {
      const songs = await instance.post('/songs/search', {
        query
      })

      if (songs.status === 200) {
        setSongs(songs.data)
      } else {
        console.error('Failed to fetch songs')
      }
    } else {
      const songs = await instance.get('/songs')

      if (songs.status === 200) {
        setSongs(songs.data)
      } else {
        console.error('Failed to fetch songs')
      }
    }
  }

  useEffect(() => {
    updateSongs()
  }, [])

  return (
    <div className={styles.songs}>
      <div className={styles.header}>
        <h2>All songs</h2>
        <div className={styles.search}>
          <input
            ref={queryRef}
            type="text"
            placeholder="Search..."
            onKeyDown={e => e.key === 'Enter' && updateSongs()}
          />
          <button onClick={updateSongs}>
            <span className="material-icons">search</span>
          </button>
        </div>
      </div>
      {songs ? (
        <table>
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
            {songs &&
              songs.map((song: any) => (
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
      ) : (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Songs
