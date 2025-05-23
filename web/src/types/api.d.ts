interface Song {
  id: string
  title: string
  artist: string
  genre: string
  vibes: string[]
}

interface User {
  id: string
  username: string
  type: 'user' | 'admin'
}

interface Playlist {
  id: string
  name: string
  occasions: string[]
}

type PlaylistWithCount = Playlist & {
  songs: number
}

type PlaylistWithSongs = Playlist & {
  songs: Song[]
}
