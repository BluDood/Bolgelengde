import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout.tsx'
import Login from './pages/Login/Login.tsx'
import Register from './pages/Register/Register.tsx'
import Songs from './pages/Songs/Songs.tsx'
import NewSong from './pages/NewSong/NewSong.tsx'
import Me from './pages/Me/Me.tsx'
import SongView from './pages/SongView/SongView.tsx'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={'/songs'} />} />
        <Route path="songs" element={<Songs />} />
        <Route path="songs/:id" element={<SongView />} />
        <Route path="songs/new" element={<NewSong />} />
        <Route path="me" element={<Me />} />
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
