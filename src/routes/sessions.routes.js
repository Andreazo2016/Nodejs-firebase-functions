const { Router } = require('express')
const firebase = require('firebase')
const { getUserById } = require('../services/firestoreService')
const errosMessageFirebase = require('../erros/capture-error-message-firebase')

const routes = Router()


routes.post('/create', async (req, res) => {

  const { email, password } = req.body

  try {

    if (!email || !password) return res.status(400).json({ message: 'Missing params' })

    let { user } = await firebase.auth().signInWithEmailAndPassword(email, password)

    return res.status(201).json(user)

  } catch (error) {
    console.log(error)
    const { status, message } = errosMessageFirebase(error)
    return res.status(status).json({ message })
  }
})



module.exports = routes