import { Playlist, Song } from '../../generated/prisma/index.js'
import prisma from './prisma.js'
import { filterSong } from './songs.js'
import { logger } from './utils.js'

// filtrer spilleliste for sending tilbake til bruker
// sjekk om spillelisten inkluderer sanger eller antall sanger
// og filtrer basert på det
export function filterPlaylist(
  playlist:
    | Playlist
    | (Playlist & { songs: Song[] })
    | (Playlist & { _count: { songs: number } })
) {
  if ('songs' in playlist) {
    return {
      id: playlist.id,
      name: playlist.name,
      occasions: playlist.occasions,
      songs: playlist.songs.map(filterSong)
    }
  } else if ('_count' in playlist) {
    return {
      id: playlist.id,
      name: playlist.name,
      occasions: playlist.occasions,
      songs: playlist._count.songs
    }
  } else {
    return {
      id: playlist.id,
      name: playlist.name,
      occasions: playlist.occasions
    }
  }
}

// lage spilleliste, en spilleliste har eier og må derfor ha en userId
export async function createPlaylist({
  name,
  occasions,
  userId
}: {
  name: string
  occasions: string[]
  userId: string
}) {
  const playlist = await prisma.playlist.create({
    data: {
      name,
      occasions,
      userId
    }
  })

  return playlist
}

// hent en brukers spillelister, inkluderer antall sanger
export async function getPlaylists(userId: string) {
  const playlists = await prisma.playlist.findMany({
    where: {
      userId
    },
    include: {
      _count: {
        select: {
          songs: true
        }
      }
    }
  })

  return playlists
}

// hent en spilleliste, inkluderer sanger
export async function getPlaylist(id: string) {
  const playlist = await prisma.playlist.findUnique({
    where: {
      id
    },
    include: {
      songs: true
    }
  })

  return playlist
}

// oppdater spilleliste, dataen som skal oppdateres kan være valgfritt for å beholde den forrige verdien
export async function updatePlaylist(
  id: string,
  data: Partial<{
    name: string
    occasions: string[]
    songs: string[]
  }>
) {
  const playlist = await prisma.playlist.update({
    where: {
      id
    },
    data: {
      name: data.name,
      occasions: data.occasions,
      songs: {
        set: data.songs?.map(id => ({ id }))
      }
    }
  })

  return playlist
}

// slett spilleliste
export async function deletePlaylist(id: string) {
  const playlist = await prisma.playlist.delete({
    where: {
      id
    }
  })

  return playlist
}

// sjekk om en liste over sanger til en spilleliste er gyldig basert på regler:
// alle sanger må ha samme sjanger
// alle sanger må ha minst en felles stemning
export async function checkPlaylistValidity(songIds: string[]) {
  // om det kun er en sang i spillelisten er det alltid gyldig
  if (songIds.length <= 1) return true
  // hent sanger fra databasen
  const songs = await prisma.song.findMany({
    where: {
      id: {
        in: songIds
      }
    }
  })

  // hent alle sjangere fra sangene
  const allGenres = songs.map(song => song.genre)
  // bruk Set for å fjerne duplikater
  const uniqueGenres = [...new Set(allGenres)]

  // er listen over unike sjangere mindre enn listen over alle sjangere betyr det at noen sanger deler sjanger, som ikke er gyldig
  if (allGenres.length > uniqueGenres.length) {
    logger.debug(
      'Failed playlist validation: Some songs share genres',
      'PlaylistValidation'
    )
    return false
  }

  // hent alle stemninger fra sangene
  const allVibes = songs.map(song => song.vibes)
  // lag en liste over stemninger som er felles for alle sangene
  const sharedKeywords = allVibes.reduce((acc, keywords) => {
    return acc.filter(value => keywords.includes(value))
  })
  // hvis det ikke er noen felles stemninger ikke spillelisten gyldig
  if (sharedKeywords.length === 0) {
    logger.debug(
      'Failed playlist validation: Songs have no shared vibes',
      'PlaylistValidation'
    )
    return false
  }

  return true
}
