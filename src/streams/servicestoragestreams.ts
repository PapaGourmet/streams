import { getStorage, ref, getStream, getMetadata } from "firebase/storage"
import config from "../firebase/config"
import { promisify } from 'util'
import { IServiceStream } from "./iservicestream"


export class ServiceStorageStream implements IServiceStream {
    async getMetadata(bucket: string, fileName: string): Promise<any> {
        const storage = getStorage(config, bucket)
        const storageRef = ref(storage, fileName)
        const metadata = await getMetadata(storageRef)
        return metadata
    }

    getStream(bucket: string, fileName: string): NodeJS.ReadableStream {

        const storage = getStorage(config, bucket)
        const storageRef = ref(storage, fileName)

        try {
            return getStream(storageRef)

        } catch (err) {
            throw err
        }

    }
}






