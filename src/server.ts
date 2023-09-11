import express, { Request, Response } from "express"
import { Readable, Transform, Writable, pipeline } from 'stream'
import { promisify } from 'util'
import fs from 'fs'
import { ServiceStream } from "./streams/iservicestream"
import { ServiceStorageStream } from "./streams/servicestoragestreams"
const _service = new ServiceStorageStream()
const service = new ServiceStream(_service)
const filePath = '' //'src/file.mp4'
const fileSize = 0 // fs.statSync(filePath).size

const pipelineAsync = promisify(pipeline)

const server = express()
const port = 5000 || process.env.PORT

server.get("/", (req: Request, res: Response) => {

    let start = 0
    let end = 0
    const range = req.headers.range
    if (range) {
        let [startRng, endRng] = range.replace(/bytes=/, "").split("-")
        console.log(startRng)
        start = parseInt(startRng, 10)
        end = endRng ? parseInt(endRng, 10) : fileSize - 1
    }

    res.writeHead(206, {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Content-Length": (end - start) + 1,
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    })

    if (range) {
        fs.createReadStream(filePath, { start, end }).pipe(res)
    } else {
        res.end()
    }

})

server.get("/stream", async (req: Request, res: Response) => {


    const metadata = await service.getMetadata('gs://papa-gourmet.appspot.com', '/file.mp4')
    const { type, size, contentType } = metadata
    const stream: any = service.getStream('gs://papa-gourmet.appspot.com', '/file.mp4')

    // Crie uma stream de gravação (Writable) para transmitir os dados para o navegador
    const responseStream = new Writable({
        write(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
        },
    });

    // Conecte a stream de leitura à stream de gravação
    stream.pipe(responseStream);


    stream.on('error', (error: any) => console.log(error))

    stream.on('end', () => {
        res.end()
    })

    const head = {
        'Content-Length': size,
        'Content-Type': contentType,
    }

    stream.pipe(res)
})

server.listen(port)
