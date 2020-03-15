
export default () => ({
    vlc: {
        host: process.env.VLC_HOST || 'localhost',
        port: parseInt(process.env.VLC_PORT, 10) || 8080,
        password: process.env.VLC_PASSWORD
    },
    fs: {
        root: process.env.FS_BASE_PATH,
        playlists: process.env.FS_PLAYLIST_SUBFOLDER || 'Playlists'
    }
  });