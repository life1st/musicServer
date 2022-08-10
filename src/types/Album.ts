import { Music } from './Music'
export interface Album {
    albumId: string;
    name: string;
    artist: string;
    musicIds: string[];
    coverId?: string;
    coverUrl?: string;
    songs?: Music[];
}