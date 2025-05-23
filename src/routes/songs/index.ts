import { Request, Response } from 'express'
import { createSong, filterSong, getSongs } from '../../lib/songs.js'
import { createSongSchema } from '../../lib/schemas.js'
import { logger } from '../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const songs = await getSongs()

  res.send(songs.map(filterSong))
}

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsed = createSongSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { title, artist, genre, vibes } = parsed.data

  const song = await createSong({
    title,
    artist,
    genre,
    vibes
  })

  logger.debug(
    `User ${req.user.username} created song ${song.title} by ${song.artist}`,
    'songs'
  )

  res.send(filterSong(song))
}
