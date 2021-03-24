module.exports = (err) => {
  const code = err.code ? err.code : 'internal-server-error'
  const errors = {
    'auth/user-not-found': {
      status: 400,
      message: 'User not found'
    },
    'auth/email-already-in-use': {
      status: 400,
      message: 'Email already used'
    },
    'internal-server-error': { status: 500, message: 'Internal Server Error' }
  }
  return errors[code]
}