import { StorageReference } from "firebase/storage"

export interface IServiceStream {
    getStream(bucket: string, fileName: string): NodeJS.ReadableStream

    getMetadata(bucket: string, fileName: string): Promise<any>
}


export class ServiceStream {
    constructor(private service: IServiceStream) { }

    async getMetadata(bucket: string, fileName: string): Promise<any>{
        return this.service.getMetadata(bucket, fileName)
    }

    getStream(bucket: string, fileName: string): NodeJS.ReadableStream {
        return this.service.getStream(bucket, fileName)
    }
}