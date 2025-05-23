import { Request, Response } from 'express'
import {
  createPlaylist,
  filterPlaylist,
  getPlaylists
} from '../../lib/playlists.js'
import { createPlaylistSchema } from '../../lib/schemas.js'
import { logger } from '../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const playlists = await getPlaylists(req.user.id)

  res.send(playlists.map(filterPlaylist))
}

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsed = createPlaylistSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { name, occasions } = parsed.data

  const playlist = await createPlaylist({
    name,
    occasions,
    userId: req.user.id
  })

  logger.debug(
    `User ${req.user.username} created playlist ${playlist.name}`,
    'playlists'
  )

  res.send(filterPlaylist(playlist))
}
