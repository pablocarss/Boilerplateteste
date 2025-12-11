import { Client } from 'minio'

const endPoint = process.env.MINIO_ENDPOINT || 'localhost'
const port = parseInt(process.env.MINIO_PORT || '9000', 10)
const useSSL = (process.env.MINIO_USE_SSL || 'false') === 'true'
const accessKey = process.env.MINIO_ACCESS_KEY || ''
const secretKey = process.env.MINIO_SECRET_KEY || ''

export const minio = new Client({ endPoint, port, useSSL, accessKey, secretKey })

export const bucket = process.env.MINIO_BUCKET || 'uploads'
