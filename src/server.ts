import express, { Request, Response } from "express"
import { Writable } from 'stream'
import fs from 'fs'
import { ServiceStream } from "./streams/iservicestream"
import { ServiceStorageStream } from "./streams/servicestoragestreams"
const _service = new ServiceStorageStream()
const service = new ServiceStream(_service)

const server = express()
const port = 5000 || process.env.PORT

server.get("/stream", async (req: Request, res: Response) => {


    const metadata = await service.getMetadata('gs://papa-gourmet.appspot.com', '/file.mp4')
    const { type, size, contentType } = metadata
    const stream: any = service.getStream('gs://papa-gourmet.appspot.com', '/file.mp4')

    // Crie uma stream de gravação (Writable) para transmitir os dados para o navegador
    const responseStream = new Writable({
        write(chunk, encoding, callback) {
            res.write(chunk, encoding)
            callback()
        },
    })

    const head = {
        'Content-Length': size,
        'Content-Type': contentType,
    }

    res.writeHead(200, head)

    stream.pipe(responseStream)

    stream.on('error', (error: any) => console.log(error))
    stream.on('end', () => res.end())
})

server.listen(port)