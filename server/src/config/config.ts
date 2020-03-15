
export default () => {
  let a = {
    vlc: {
        host: process.env.VLC_HOST || 'localhost',
        port: parseInt(process.env.VLC_PORT, 10) || 8080,
        password: process.env.VLC_PASSWORD
    },
    fs: {
        cloudcmd_root: process.env.FS_BASE_PATH_CLOUDCMD || process.env.FS_BASE_PATH,
        vlc_root: process.env.FS_BASE_PATH_VLC || process.env.FS_BASE_PATH,
        playlists: process.env.FS_PLAYLIST_SUBFOLDER || 'Playlists'
    }
  }
  console.log(a);
  return a;
};