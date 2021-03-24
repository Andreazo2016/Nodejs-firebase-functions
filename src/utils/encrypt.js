const crypto = require('crypto-js')


exports.decryptAES = (message, secret) => crypto.AES.decrypt(message, secret).toString(crypto.enc.Utf8);


exports.encryptAES = (message, secret) => crypto.AES.encrypt(message, secret).toString();