import { Request, Response } from 'express'
import { createSong, getSongs } from '../../lib/songs.js'
import { createSongSchema } from '../../lib/schemas.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const songs = await getSongs()

  res.send(songs)
}

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = createSongSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { title, artist, genre, vibes } = parsed.data

  const song = await createSong({
    title,
    artist,
    genre,
    vibes
  })

  res.send(song)
}
