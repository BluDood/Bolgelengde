import prisma from './prisma.js'

export async function getSongs() {
  const song = await prisma.song.findMany()

  return song
}

export async function getSong(id: string) {
  const song = await prisma.song.findUnique({
    where: {
      id
    }
  })

  return song
}

export async function createSong({
  title,
  artist,
  genre,
  vibes
}: {
  title: string
  artist: string
  genre: string
  vibes: string[]
}) {
  const song = await prisma.song.create({
    data: {
      title,
      artist,
      genre,
      vibes
    }
  })

  return song
}

export async function updateSong(
  id: string,
  {
    title,
    artist,
    genre,
    vibes
  }: {
    title?: string
    artist?: string
    genre?: string
    vibes?: string[]
  }
) {
  const song = await prisma.song.update({
    where: {
      id
    },
    data: {
      title,
      artist,
      genre,
      vibes
    }
  })

  return song
}

export async function deleteSong(id: string) {
  const song = await prisma.song.delete({
    where: {
      id
    }
  })

  return song
}

export async function searchSongs(query: string) {
  const songs = await prisma.song.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          artist: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          genre: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          vibes: {
            hasSome: [query]
          }
        }
      ]
    }
  })

  return songs
}
