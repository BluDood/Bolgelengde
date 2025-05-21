import { Request, Response } from 'express'
import { idSchema, updateSongSchema } from '../../../lib/schemas.js'
import { deleteSong, getSong, updateSong } from '../../../lib/songs.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = idSchema.safeParse(req.params)
  if (!parsed.success) return res.sendStatus(400)
  const { id } = parsed.data

  const song = await getSong(id)
  if (!song) return res.sendStatus(404)

  res.send(song)
}

export async function patch(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsedParams = idSchema.safeParse(req.params)
  if (!parsedParams.success) return res.sendStatus(400)
  const { id } = parsedParams.data

  const parsed = updateSongSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { title, artist, genre, vibes } = parsed.data

  const song = await updateSong(id, {
    title,
    artist,
    genre,
    vibes
  })

  res.send(song)
}

export async function del(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = idSchema.safeParse(req.params)
  if (!parsed.success) return res.sendStatus(400)
  const { id } = parsed.data

  const song = await getSong(id)
  if (!song) return res.sendStatus(404)

  await deleteSong(id)

  res.sendStatus(204)
}
