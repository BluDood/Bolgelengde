import { Request, Response } from 'express'
import { searchSongSchema } from '../../lib/schemas.js'
import { filterSong, searchSongs } from '../../lib/songs.js'

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = searchSongSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { query } = parsed.data

  const results = await searchSongs(query)

  res.send(results.map(filterSong))
}
