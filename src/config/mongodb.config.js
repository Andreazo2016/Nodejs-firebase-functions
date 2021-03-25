const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/nodejsFirebasedb', {
  useFindAndModify: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
})

module.exports = mongoose