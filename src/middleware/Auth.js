const adminFirebase = require('firebase-admin')
module.exports = async (req, res, next) => {

  const { authorization } = req.headers

  try {

    await adminFirebase.auth().verifyIdToken(authorization)

    next()

  } catch (error) {
    return res.status(401).json({ message: 'Ivalid token' })
  }

}