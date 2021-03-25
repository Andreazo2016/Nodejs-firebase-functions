const { Schema, model } = require('mongoose')

const ReminderSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  },
  userId: String,
  value: Number,
  due_date: Date

}, {
  timestamps: true
})

module.exports = model('Remider', ReminderSchema)