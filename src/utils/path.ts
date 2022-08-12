import os from 'os'
import path from 'path'
import { env } from './env'

const HOME_DIR = os.homedir()

export const CONFIG_DIR = env.isDev ? path.join(HOME_DIR, 'Documents/musicCenter/config') : path.resolve('/config')
export const MUSIC_DIR = env.isDev ? path.join(HOME_DIR, 'Documents/music') : path.resolve('/music')
export const DB_DIR = env.isDev ? path.join(HOME_DIR, 'Documents/musicCenter/config/db') : path.resolve('/config/db')

export const COVER_DIR = path.join(CONFIG_DIR, 'cover')
export const STATIC_DIR = 'dist/static'
