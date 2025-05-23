import { Request, Response } from 'express'
import {
  checkPlaylistValidity,
  deletePlaylist,
  filterPlaylist,
  getPlaylist,
  updatePlaylist
} from '../../../lib/playlists.js'
import { updatePlaylistSchema } from '../../../lib/schemas.js'
import { logger } from '../../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const playlist = await getPlaylist(req.params.id)
  if (!playlist) return res.sendStatus(404)
  if (playlist.userId !== req.user.id) return res.sendStatus(404)

  res.json(filterPlaylist(playlist))
}

export async function patch(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsed = updatePlaylistSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { name, occasions, songs } = parsed.data

  const playlist = await getPlaylist(req.params.id)

  if (!playlist) return res.sendStatus(404)
  if (playlist.userId !== req.user.id) return res.sendStatus(404)

  if (songs) {
    const valid = await checkPlaylistValidity(songs)

    if (!valid) return res.sendStatus(400)
  }

  const updated = await updatePlaylist(playlist.id, {
    name,
    occasions,
    songs
  })

  logger.debug(
    `User ${req.user.username} updated playlist ${playlist.name}`,
    'playlists'
  )

  res.json(filterPlaylist(updated))
}

export async function del(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const playlist = await getPlaylist(req.params.id)
  if (!playlist) return res.sendStatus(404)
  if (playlist.userId !== req.user.id) return res.sendStatus(404)

  await deletePlaylist(req.params.id)

  logger.debug(
    `User ${req.user.username} deleted playlist ${playlist.name}`,
    'playlists'
  )

  res.sendStatus(204)
}
