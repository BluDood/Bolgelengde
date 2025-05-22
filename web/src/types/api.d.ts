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
