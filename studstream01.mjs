import fs from 'fs'
import xlsx from 'xlsx'
import { Readable, Transform, Writable, pipeline } from 'stream'
import { promisify } from 'util'
import * as json from './citys.mjs'
import { utils } from 'xlsx'
const filePath = 'file.xls'
const output = []
const headers =
    [
        'MTR Nº',
        'Destinador Nome',
        'Destinador CPF/CNPJ',
        'Transportador Nome',
        'Transportador CPF/CNPJ',
        'Gerador Nome',
        'Gerador CPF/CNPJ',
        'Motorista',
        'Placa',
        'Situação',
        'Data de Emissão',
        'Data de Recebimento',
        'Responsável Recebimento',
        'Residuo código/descrição',
        'Classe',
        'Qt. tonelada',
        'Qt. unidade',
        'Descrição int. do Gerador',
        'Identificação int. do Gerador',
        'Identificação int. do Destinador',
        'Observações',
        'Tecnologia',
        'CDF'
    ]


{
    const pipelineAsync = promisify(pipeline)

    const readableStream = new Readable({
        read() {
            const workbook = xlsx.readFile(filePath)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = xlsx.utils.sheet_to_json(worksheet)

            for (let obj of jsonData) {
                const data = JSON.stringify(obj)
                this.push(data)
            }

            this.push(null)

        },
    })

    const transformStream = new Transform({
        transform(chunk, encoding, cb) {
            let count = 0
            const object = JSON.parse(chunk)
            let element = {}
            for (const chave in object) {
                if (object.hasOwnProperty(chave)) {
                    element[headers[count]] = object[chave]
                    count++
                }
            }

            cb(null, JSON.stringify(element))
        },
    })

    const writableStream = Writable(
        {
            write(chunck, enconding, cb) {
                const obj = JSON.parse(chunck)
                const index = json.citys.findIndex(x => x['cnpj'] === obj['Gerador CPF/CNPJ'])
                output.push({ ...obj, 'cidade': json.citys[index].city })
                cb()
            }
        }
    )

    await pipelineAsync(
        readableStream,
        transformStream,
        writableStream
    )

    const outputFilePath = 'output.xlsx'
    json.convertJsonToXls(output, outputFilePath)

}