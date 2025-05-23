import { Song } from '../../generated/prisma/index.js'
import prisma from './prisma.js'

// filtrer sang for sending tilbake til bruker
export function filterSong(song: Song) {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    genre: song.genre,
    vibes: song.vibes
  }
}

// hent alle sanger
export async function getSongs() {
  const song = await prisma.song.findMany()

  return song
}

// hent en sang
export async function getSong(id: string) {
  const song = await prisma.song.findUnique({
    where: {
      id
    }
  })

  return song
}

// lag sang
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

// oppdater sang, dataen som skal oppdateres kan være valgfritt for å beholde den forrige verdien
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

// slett sang
export async function deleteSong(id: string) {
  const song = await prisma.song.delete({
    where: {
      id
    }
  })

  return song
}

// søk etter sanger, som sjekker om søket finnes i en tittel, artist, sjanger eller vibe
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
