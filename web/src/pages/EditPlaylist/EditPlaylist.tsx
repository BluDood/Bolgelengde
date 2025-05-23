import React, { useEffect } from 'react'
import styles from './EditPlaylist.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const EditPlaylist: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const occasionsRef = React.useRef<HTMLInputElement>(null)
  const [playlist, setPlaylist] = React.useState<PlaylistWithSongs | null>(
    null
  )
  const [songs, setSongs] = React.useState<Song[] | null>(null)
  const newSongRef = React.useRef<HTMLSelectElement>(null)

  async function update() {
    const name = nameRef.current?.value
    const occasions = occasionsRef.current?.value

    // sjekk om alle feltene er fylt ut
    if (!name || !occasions) {
      alert('Please fill in all fields')
      return
    }

    // oppdater spillelisten
    const res = await instance.patch(`/playlists/${params.id}`, {
      name,
      // splitt occasions siden det lagret som liste i databasen
      occasions: occasions
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0),
      songs: playlist!.songs.map(song => song.id)
    })

    if (res.status === 200) {
      // naviger tilbake til spillelisten
      navigate(`/playlists/${res.data.id}`)
    } else {
      if (res.status === 400) {
        // 400 betyr at sjekken etter reglene feilet, vis melding til bruker
        alert(
          'Please ensure all songs are in unique genres, and contain at least one common vibe.'
        )
      } else {
        alert('Error updating playlist')
      }
    }
  }

  useEffect(() => {
    async function fetchPlaylist() {
      const res = await instance.get(`/playlists/${params.id}`)

      if (res.status === 200) {
        setPlaylist(res.data)
      } else {
        alert('Error fetching playlist')
      }
    }

    async function fetchSongs() {
      // hent alle sanger, som gjør at brukeren kan legge til sanger i spillelisten
      const res = await instance.get('/songs')

      if (res.status === 200) {
        setSongs(res.data)
      } else {
        alert('Error fetching songs')
      }
    }

    fetchPlaylist()
    fetchSongs()
  }, [params.id])

  return playlist && songs ? (
    <div className={styles.update}>
      <h2>Update playlist</h2>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.title}
          placeholder="Name"
          ref={nameRef}
          defaultValue={playlist.name}
        />
        <div className={styles.actions}>
          <button className={styles.save}>
            <div className="material-icons" onClick={update}>
              save
            </div>
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.field}>
          <h3>Occasions (space-separated)</h3>
          <input
            type="text"
            ref={occasionsRef}
            defaultValue={playlist.occasions.join(' ')}
          />
        </div>
      </div>
      <div className={styles.songs}>
        <h3>Songs</h3>
        <div className={styles.list}>
          {playlist.songs.map((song, i) => (
            <div key={i} className={styles.song}>
              <div className={styles.text}>
                <h2>{song.title}</h2>
                <p>{song.artist}</p>
              </div>
              <button
                data-type="delete"
                onClick={() =>
                  setPlaylist({
                    ...playlist,
                    songs: playlist.songs.filter((_, index) => index !== i)
                  })
                }
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))}
          <div className={styles.song}>
            <select ref={newSongRef}>
              <option selected disabled hidden value="">
                Add a song
              </option>
              {songs
                .filter(s => !playlist.songs.find(n => n.id === s.id))
                .map((song, i) => (
                  <option key={i} value={song.id}>
                    {song.title} - {song.artist}
                  </option>
                ))}
            </select>
            <button
              onClick={() => {
                const song = songs.find(
                  song => song.id === newSongRef.current?.value
                )
                if (!song) return
                setPlaylist({
                  ...playlist,
                  songs: [...playlist.songs, song]
                })
                newSongRef.current!.value = ''
              }}
            >
              <span className="material-icons">add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default EditPlaylist
