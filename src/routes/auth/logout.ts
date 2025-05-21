import { Request, Response } from 'express'
import { deleteToken } from '../../lib/tokens.js'

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  await deleteToken(req.user.token.hash)

  res.sendStatus(204)
}
