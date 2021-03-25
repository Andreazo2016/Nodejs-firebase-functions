const momentTimeZone = require('moment-timezone')

require('moment/locale/pt-br')

module.exports = ({ _id, title, description, due_date, value }) => ({
  id: _id,
  title,
  description,
  value,
  due_date: momentTimeZone(due_date).tz('America/Sao_Paulo').format('LLLL')
})