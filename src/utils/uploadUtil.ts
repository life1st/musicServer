import path from 'path'
import { existsSync, createWriteStream } from 'fs'
import busboy from 'busboy'

export const uploader = async (conf: {
  limitSize?: number,
  uploadFolder: string,
  delay?: number,
  req,
}) => {
  const {
    limitSize = 1024 * 1024,
    delay = 3000,
    uploadFolder,
    req,
  } = conf

  let result = {
    success: true,
    msg: ''
  }
  if (!uploadFolder) {
    result.success = false
    result.msg = 'required params not complate offered.'
  }
  const contentLength = req.headers['content-length']
  if (contentLength > limitSize) {
    result.success = false
    result.msg = 'size to large.'
  }

  const bb = busboy({ headers: req.headers })

  await new Promise((resolve, reject) => {
    bb.on('field', (name, val, info) => {
      console.log(`Field [${name}]: value: %j`, val);
    });

    bb.on('file', (name, file, info) => {
      const { filename } = info
      const filepath = path.join(uploadFolder, `${filename}`)
      if (existsSync(filepath)) {
        result.success = false
        result.msg = 'same file has been uploaded.'
        reject(result)
        return
      }
      result.filename = filename
      const writeStream = createWriteStream(filepath)
      file.on('data', (chunk) => {
        console.log(`File [${name}] got ${chunk.length} bytes`);
        writeStream.write(chunk)
      }).on('close', () => {
        writeStream.end()
        console.log(`File [${name}] done`);
      });
    })

    bb.on('close', () => {
      console.log('Done parsing form!');
      resolve(true)
    });
    
    setTimeout(() => {
      resolve(false)
    }, delay);
    req.pipe(bb);
  })

  return result
}