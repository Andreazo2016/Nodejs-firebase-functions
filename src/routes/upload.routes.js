const { Router } = require('express')
const UploadService = require('../services/uploadService')


const routes = Router()

/**
 *  - [x] Usar o busboy.
 *  - [x] Fazer o upload do CSV com busboy localmente.
 *  - [x] Validar se o arquivo é realmente CSV.
 *  - [x] Ver como o busboy manipula arquivo.
 *  - [] Depois de pegar os dados do arquivo, transformalos em json (verificar headers)
 *  - [x] Remover o arquivo CSV local.
 */

routes.post('/csv', async (req, res) => {

  try {

    const { status, statusCode, message } = await UploadService.register(req)


    return res.status(statusCode).json({ message })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})



module.exports = routes