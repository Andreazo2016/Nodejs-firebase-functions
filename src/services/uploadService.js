const Busboy = require("busboy")
const path = require('path')
const fs = require('fs')




class UploadService {
  pathToSaveFile
  filenamesArray = []
  promiseArray = []
  constructor() {
    this.pathToSaveFile = path.resolve(__dirname, '..', '..', 'tmp')
  }


  register(request) {

    return new Promise((resolve, reject) => {

      const { headers, rawBody } = request

      const busboy = new Busboy({ headers })

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {


        if (!['text/csv'].includes(mimetype)) {
          file.resume() // ignora essa parte do arquivo
          reject({ status: 'error', statusCode: 400, message: 'File type not supported' })
        }

        file.on('data', function (data) { }) // evento que vai ser chamado a cada pedaço do arquivo chege em file

        const writeStream = fs.createWriteStream(`${this.pathToSaveFile}/${filename}`)

        //Cada pedaço do arquivo que chega em file, ele vai passar pro createWriteStream, para salvar
        file.pipe(writeStream)


        const promise = new Promise((resolve, reject) => {
          file.on('end', () => {
            writeStream.end();
          });
          //evento que vai ser chamado quando ocorrer algum erro na gravação do arquivo pelo fs
          writeStream.on('error', resolve({ status: 'error', message: 'file was not uploaded' }))
          writeStream.on('finish', resolve({ status: 'sucess', message: 'file uploaded' }));

        });

        this.promiseArray.push(promise)
        this.filenamesArray.push(filename)

      })

      busboy.on('finish', async () => {

        //resolve todos as promises pendentes em salvar o arquivos
        await Promise.all(this.promiseArray)



        //verifica se há algum arquivo que não foi salvo
        for (let filename of this.filenamesArray) {
          if (!fs.existsSync(this.pathToSaveFile + '/' + filename)) {
            reject({
              status: 'error',
              statusCode: 500,
              message: `the File ${filename} was not uploded`
            })
          }
        }

        //TODO manipular o arquivo csv




        //removendo os arquivos
        for (let filename of this.filenamesArray) {
          fs.unlinkSync(this.pathToSaveFile + '/' + filename)
        }


        resolve({
          status: 'success',
          statusCode: 200,
          message: 'File was uploded with success'
        })

        //

      })

      busboy.end(rawBody)
    })


  }
}

module.exports = new UploadService()