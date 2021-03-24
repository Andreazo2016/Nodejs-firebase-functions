const { Router } = require('express')
const firebase = require('firebase')
const { saveUser } = require('../services/firestoreService')
const authMiddleware = require('../middleware/Auth')

const errosMessageFirebase = require('../erros/capture-error-message-firebase')

const routes = Router()

routes.get('/test', authMiddleware, async (req, res) => {
  return res.json({ ok: true })
})


routes.post('/create', async (req, res) => {

  const { name, email, password } = req.body

  try {

    if (!name || !email || !password) return res.status(400).json({ message: 'Missing params' })

    const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password)

    let userToSave = { id: user.uid, name, email }

    await saveUser(userToSave)

    return res.status(201).json(userToSave)

  } catch (error) {
    console.log(error)
    const { status, message } = errosMessageFirebase(error)
    return res.status(status).json({ message })
  }
})



module.exports = routes