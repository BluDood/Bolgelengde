# Bølgelengde

En full-stack webapplikasjon for å ha oversikt over sanger, og kunne legge de inn i spillelister. Inkluderer hjemmelaget autentisering med sikker lagring av passord ved bruk av hashing og salting, og autorisering for å skille mellom admin-brukere og vanlige brukere.

## Dokumentasjon

- Backend: [/src](./src)
  - Logikk for sanger: [/src/lib/songs.ts](./src/lib/songs.ts)
  - Logikk for spillelister: [/src/lib/playlists.ts](./src/lib/playlists.ts)
  - API-routes for frontend-kommunikasjon: [/src/routes](./src/routes)
- Frontend: [/web](./web)
  - Oversikt over sanger: [/web/src/pages/Songs/Songs.tsx](./web/src/pages/Songs/Songs.tsx)
  - Visning av sang: [/web/src/pages/SongView/SongView.tsx](./web/src/pages/SongView/SongView.tsx)
  - Redigering av sang: [/web/src/pages/EditSong/EditSong.tsx](./web/src/pages/EditSong/EditSong.tsx)
  - Oppretting av sang: [/web/src/pages/NewSong/NewSong.tsx](./web/src/pages/NewSong/NewSong.tsx)
  - Oversikt over spillelister: [/web/src/pages/Playlists/Playlists.tsx](./web/src/pages/Playlists/Playlists.tsx)
  - Visning av spilleliste: [/web/src/pages/PlaylistView/PlaylistView.tsx](./web/src/pages/PlaylistView/PlaylistView.tsx)
  - Redigering av spilleliste: [/web/src/pages/EditPlaylist/EditPlaylist.tsx](./web/src/pages/EditPlaylist/EditPlaylist.tsx)
  - Oppretting av spilleliste: [/web/src/pages/NewPlaylist/NewPlaylist.tsx](./web/src/pages/NewPlaylist/NewPlaylist.tsx)
  - Visning og redigering av profil: [/web/src/pages/Me/Me.tsx](./web/src/pages/Me/Me.tsx)
  - Innlogging: [/web/src/pages/Login/Login.tsx](./web/src/pages/Login/Login.tsx)
  - Registrering: [/web/src/pages/Register/Register.tsx](./web/src/pages/Register/Register.tsx)

## Kjøring (produksjon)

Her trenger du Docker installert.

```bash
# Klon repositoriet
$ git clone https://github.com/BluDood/Bølgelengde
# Bygg og kjør Docker-filen
$ docker compose up --build -d
```

## Utvikling

Du trenger Node installert, nåverende LTS er 22.16

```bash
# Klon repositoriet
$ git clone https://github.com/BluDood/Bølgelengde
# Installer node_modules, og start serveren i utviklings-modus
$ npm i
$ npm run dev
# Åpne en ny terminal
# Installer node_modules, og start nettsiden i utviklings-modus
$ cd web
$ npm i
$ npm run dev
```
