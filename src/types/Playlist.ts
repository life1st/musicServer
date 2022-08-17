import { Music } from './Music'

export interface Playlist {
  id: string;
  title: string;
  createTime: string;
  updateTime: string;
  coverId?: string;
  coverUrl?: string;
  musicIds: string[];
  songs?: Music[];
}
