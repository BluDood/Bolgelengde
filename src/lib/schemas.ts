import { z } from 'zod'

export const username = z.string().min(3).max(32)
export const password = z.string().min(8)
export const id = z.string().max(32)

export const loginSchema = z.object({
  username,
  password
})

export const registerSchema = z.object({
  username,
  password
})

export const updateUserSchema = z.object({
  username
})

export const idSchema = z.object({
  id
})

export const createSongSchema = z.object({
  title: z.string().min(1).max(64),
  artist: z.string().min(1).max(64),
  genre: z.string().min(1).max(32),
  vibes: z.array(z.string().min(1).max(16)).min(1).max(5)
})

export const updateSongSchema = z.object({
  title: z.string().min(1).max(64).optional(),
  artist: z.string().min(1).max(64).optional(),
  genre: z.string().min(1).max(32).optional(),
  vibes: z.array(z.string()).min(1).max(16).optional()
})

export const searchSongSchema = z.object({
  query: z.string().min(1).max(64)
})
