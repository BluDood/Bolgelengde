import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout.tsx'
import Login from './pages/Login/Login.tsx'
import Register from './pages/Register/Register.tsx'
import Songs from './pages/Songs/Songs.tsx'
import NewSong from './pages/NewSong/NewSong.tsx'
import Me from './pages/Me/Me.tsx'
import SongView from './pages/SongView/SongView.tsx'
import EditSong from './pages/EditSong/EditSong.tsx'
import Playlists from './pages/Playlists/Playlists.tsx'
import PlaylistView from './pages/PlaylistView/PlaylistView.tsx'
import EditPlaylist from './pages/EditPlaylist/EditPlaylist.tsx'
import NewPlaylist from './pages/NewPlaylist/NewPlaylist.tsx'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={'/songs'} />} />
        <Route path="songs" element={<Songs />} />
        <Route path="songs/:id" element={<SongView />} />
        <Route path="songs/:id/edit" element={<EditSong />} />
        <Route path="songs/new" element={<NewSong />} />
        <Route path="me" element={<Me />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="playlists/:id" element={<PlaylistView />} />
        <Route path="playlists/:id/edit" element={<EditPlaylist />} />
        <Route path="playlists/new" element={<NewPlaylist />} />
      </Route>
      <Route path="/auth">
        <Route index element={<Navigate to={'/auth/login'} />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  )
}

export default App
