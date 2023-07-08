import { createReadStream } from 'fs'
import fs from 'fs/promises'
import { DEFAULT_LIMIT } from '../shareCommon/consts'
import { albumModel } from '../model/albumModel'
import { libraryModel } from '../model/libraryModel'
import { Music } from '../types/Music'
import { Album as IAlbum } from '../types/Album'
import { genAlbumInfo } from '../utils/album'
import { genCoverInfo } from '../utils/cover'

const album2Cover = new Map()
class Album {
    async getCover(albumId: string) {
        let coverUrl = album2Cover.get(albumId)
        if (!coverUrl) {
            const album = await albumModel.getAlbum(albumId)
            if (album) {
                album2Cover.set(albumId, album?.coverUrl)
                coverUrl = album?.coverUrl
            }
        }
        if (album2Cover.size > 300) {
            album2Cover.clear()
        }
        if (coverUrl) {
            return createReadStream(coverUrl)
        }
        return null
    }

    async getAlbum(albumId: string, config: { needSongs?: boolean } = {}) {
        return albumModel.getAlbum(albumId, config)
    }

    async getAlbumList({pageNum, artist, name, needSongs, limit = DEFAULT_LIMIT}: {
        pageNum: number;
        name?: string;
        artist?: string;
        needSongs?: boolean;
        limit?: number;
    }) {
        const condition: any = {}
        if (artist) {
            condition.artist = { $regex: new RegExp(artist) }
        }
        if (name) {
            condition.name = { $regex: new RegExp(name) }
        }
        const albums = await albumModel.getAlbumListBy(condition, { pageNum, limit })
        if (needSongs) {
            const albumList = await Promise.all(albums.map(async album => (
                { 
                    ...album, 
                    songs: await libraryModel.getMusicListBy({ids: album.musicIds}) 
                }
            )))
            return albumList
        }
        return albums
    }
    
    async updateAlbumBy({ music, album }: {
        music?: Music;
        album?: IAlbum
    }) {
        let hasUpdate = false
        let albumInfo: IAlbum | null = null
        let condition: {
            albumInfo?: IAlbum;
            musicId?: string;
        } = {}
        if (music) {
            albumInfo = genAlbumInfo(music)
            if (!albumInfo.coverId) {
                const { coverId, coverUrl } = await genCoverInfo({ music })
                albumInfo.coverId = coverId
                albumInfo.coverUrl = coverUrl
            }
            condition = {
                musicId: music.id,
                albumInfo
            }
        } else if (album) {
            condition.albumInfo = album
            albumInfo = album
        }
        if (condition?.albumInfo) {
            hasUpdate = await albumModel.updateAlbum(condition)
        }

        return hasUpdate ? albumInfo : null
    }

    async deleteAlbum(albumId: string) {
        return albumModel.deleteAlbum(albumId)
    }

    async createAlbumFromLibrary() {
        const LIMIT = 100
        let page = 0
        const start = Date.now()
        console.log('start create album from library', start)
        let count = 0
        while(true) {
            const musicList = await libraryModel.getMusicList(page++, LIMIT)
            console.log(`create album from library page ${page}`)
            count += musicList.length
            for (const music of musicList) {
                let musicExist = false
                try {
                    musicExist = !!await fs.stat(music.path)
                } catch {
                    console.log(`${music.path} not exist anymore.`)
                }
                if (musicExist) {
                    const albumInfo = await this.updateAlbumBy({music})
                    if (albumInfo) {
                        if (music.albumId !== albumInfo.albumId) {
                            await libraryModel.updateMusic({
                                ...music,
                                albumId: albumInfo.albumId,
                            })
                        }
                    } else if (music.albumId) {
                        const { albumId, ...restMusic} = music
                        await libraryModel.updateMusic(restMusic)
                    }
                } else {
                    await Promise.all([
                        music.albumId ? albumModel.removeMusicFromAlbum(music.albumId, music.id) : true,
                        libraryModel.deleteMusic(music.id, { saveToDel: false })
                    ])
                }
            }
            if (musicList.length < LIMIT) {
                break
            }
        }
        console.log('createAlbumFromLibrary finish', (Date.now() - start)/1000 + ' sec.', count, 'songs')
        let albumPage = 0
        let deleteAlbumsCount = 0
        while (true) {
            const albumList = await this.getAlbumList({pageNum: albumPage++})
            if (albumList.length === 0) {
                break
            }
            for (const album of albumList) {
                
                if (!album.musicIds?.length) {
                    deleteAlbumsCount++
                    await albumModel.deleteAlbum(album.albumId, { _id: album._id })
                }
            }
        }
        console.log('delete empty album finish, count:', deleteAlbumsCount, (Date.now() - start)/1000 + ' sec.')
    }
}

const album = new Album()
export { album }
