export interface Music {
    id: string;
    path: string;
    title: string;
    artist: string;
    album: string;
    genre: string;
    year?: string;
    size: string | number;
    albumId?: string;
    coverId?: string;
    coverUrl?: string;
    keyword?: string;
    extraInfo: {};
}
