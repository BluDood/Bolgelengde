import React, { useEffect, useState } from 'react'
import styles from './Playlists.module.css'
import { instance } from '../../lib/api.ts'
import { Link, useNavigate } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const Playlists: React.FC = () => {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState<PlaylistWithCount[] | null>(
    null
  )
  const [shownPlaylists, setShownPlaylists] = useState<
    PlaylistWithCount[] | null
  >(null)
  const [occasion, setOccasion] = useState<string>('')

  useEffect(() => {
    // hent alle spillelister for brukeren, som inkluderer antall sanger
    async function fetchPlaylists() {
      setPlaylists(null)
      const playlists = await instance.get<PlaylistWithCount[]>(
        '/playlists'
      )

      if (playlists.status === 200) {
        setPlaylists(playlists.data)
      } else {
        console.error('Failed to fetch playlists')
      }
    }

    fetchPlaylists()
  }, [])

  useEffect(() => {
    if (!playlists) return
    // filtrer spillelistene hvis bruker har valgt en anledning, ellers vis alle
    setShownPlaylists(null)
    // timeout brukes for at elementene skal fjernes og rendres på nytt for å vise animasjon
    setTimeout(() => {
      setShownPlaylists(
        playlists.filter(playlist =>
          ['all', ''].includes(occasion)
            ? true
            : playlist.occasions.includes(occasion)
        )
      )
    }, 0)
  }, [playlists, occasion])

  return (
    <div className={styles.playlists}>
      <div className={styles.header}>
        <h2>Your Playlists</h2>
        <div className={styles.actions}>
          {playlists ? (
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
            >
              <option disabled hidden value="">
                Filter by occasion
              </option>
              <option value="all">All</option>
              {Array.from(
                new Set(
                  playlists.map(playlist => playlist.occasions).flat()
                )
              ).map(occasion => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
          ) : null}
          <button
            className={styles.add}
            onClick={() => navigate('/playlists/new')}
          >
            <span className="material-icons">add</span>
          </button>
        </div>
      </div>
      {shownPlaylists ? (
        <div className={styles.grid}>
          {shownPlaylists.map(playlist => (
            <Link
              key={playlist.id}
              className={styles.playlist}
              to={`/playlists/${playlist.id}`}
            >
              <h2>{playlist.name}</h2>
              <p>{playlist.occasions.join(', ')}</p>
              <p>
                {playlist.songs} song
                {playlist.songs === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Playlists
