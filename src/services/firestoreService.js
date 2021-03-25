const admin = require('firebase-admin')
const secrect = require('../config/secrect')
const { use } = require('../routes/users.routes')
const { encryptAES } = require('../utils/encrypt')


class FirestoreService {
  async saveUser(id, name, email, password) {
    return new Promise((resolve) => {
      try {
        const db = admin.firestore()
        db.collection('users').doc(id).set({
          id,
          name,
          email,
          password: encryptAES(password, secrect.secrect_key)
        })
        resolve({ status: 'sucess' })
      } catch (error) {
        resolve({ status: 'failure' })
      }
    })
  }

  async getUserById(id) {

    return new Promise(resolve => {

      try {

        const db = admin.firestore()

        db.collection('users').doc(id).get().then(({ _fieldsProto }) => {

          let user = {}

          Object.assign(user, {
            id: _fieldsProto.id.stringValue,
            name: _fieldsProto.name.stringValue,
            email: _fieldsProto.email.stringValue,
          })


          resolve(user)

        })


      } catch (error) {
        resolve(null)
      }
    })
  }
}

module.exports = new FirestoreService()