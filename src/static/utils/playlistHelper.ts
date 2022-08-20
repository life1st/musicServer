import { createPlaylist } from '../API/playlistApi'
export const handleCreate = async () => {
    const name = prompt('input playlist name')
    if (name) {
        const { status, data } = await createPlaylist({ title: name, })
        console.log(status, data)
    }
}
