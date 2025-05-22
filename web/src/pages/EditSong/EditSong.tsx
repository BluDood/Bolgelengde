import React, { useEffect } from 'react'
import styles from './EditSong.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const EditSong: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const titleRef = React.useRef<HTMLInputElement>(null)
  const artistRef = React.useRef<HTMLInputElement>(null)
  const genreRef = React.useRef<HTMLInputElement>(null)
  const vibesRef = React.useRef<HTMLInputElement>(null)
  const [song, setSong] = React.useState<Song | null>(null)

  async function update() {
    const title = titleRef.current?.value
    const artist = artistRef.current?.value
    const genre = genreRef.current?.value
    const vibes = vibesRef.current?.value

    if (!title || !genre || !vibes) {
      alert('Please fill in all fields')
      return
    }

    const res = await instance.patch(`/songs/${params.id}`, {
      title,
      artist,
      genre,
      vibes: vibes
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0)
    })

    if (res.status === 200) {
      navigate(`/songs/${res.data.id}`)
    } else {
      alert('Error updating song')
    }
  }

  useEffect(() => {
    async function fetchSong() {
      const res = await instance.get(`/songs/${params.id}`)

      if (res.status === 200) {
        setSong(res.data)
      } else {
        alert('Error fetching song')
      }
    }

    fetchSong()
  }, [params.id])

  return song ? (
    <div className={styles.update}>
      <h2>Update song</h2>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.title}
          placeholder="Title"
          ref={titleRef}
          defaultValue={song.title}
        />
        <div className={styles.actions}>
          <button className={styles.save}>
            <div className="material-icons" onClick={update}>
              save
            </div>
          </button>
        </div>
      </div>
      <input
        className={styles.artist}
        ref={artistRef}
        type="text"
        placeholder="Artist"
        defaultValue={song.artist}
      />
      <div className={styles.info}>
        <div className={styles.field}>
          <h3>Genre</h3>
          <input type="text" ref={genreRef} defaultValue={song.genre} />
        </div>
        <div className={styles.field}>
          <h3>Vibes (space-separated)</h3>
          <input
            type="text"
            ref={vibesRef}
            defaultValue={song.vibes.join(' ')}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default EditSong
