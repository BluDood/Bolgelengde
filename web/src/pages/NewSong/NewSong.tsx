import React from 'react'
import styles from './NewSong.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate } from 'react-router'

const NewSong: React.FC = () => {
  const navigate = useNavigate()
  const titleRef = React.useRef<HTMLInputElement>(null)
  const artistRef = React.useRef<HTMLInputElement>(null)
  const genreRef = React.useRef<HTMLInputElement>(null)
  const vibesRef = React.useRef<HTMLInputElement>(null)

  async function create() {
    const title = titleRef.current?.value
    const artist = artistRef.current?.value
    const genre = genreRef.current?.value
    const vibes = vibesRef.current?.value

    // sjekk om alle feltene er fylt ut
    if (!title || !genre || !vibes) {
      alert('Please fill in all fields')
      return
    }

    // opprett sangen
    const res = await instance.post('/songs', {
      title,
      artist,
      genre,
      vibes: vibes
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0)
    })

    if (res.status === 200) {
      // naviger til sangen
      navigate(`/songs/${res.data.id}`)
    } else {
      alert('Error creating song')
    }
  }

  return (
    <div className={styles.new}>
      <h2>Create new song</h2>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.title}
          placeholder="Title"
          ref={titleRef}
        />
        <div className={styles.actions}>
          <button className={styles.save}>
            <div className="material-icons" onClick={create}>
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
      />
      <div className={styles.info}>
        <div className={styles.field}>
          <h3>Genre</h3>
          <input type="text" ref={genreRef} />
        </div>
        <div className={styles.field}>
          <h3>Vibes (space-separated)</h3>
          <input type="text" ref={vibesRef} />
        </div>
      </div>
    </div>
  )
}

export default NewSong
