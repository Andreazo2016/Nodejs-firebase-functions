require('../config/mongodb.config')
const Reminder = require('../schemas/reminder')

class MongoService {


  async saveReminder({ title, description, due_date, value, userId }) {

    const newReminder = await Reminder.create({
      title,
      description,
      due_date,
      value,
      userId
    })

    return newReminder

  }


  async getAllRemindersNotSentLength() {
    const reminenders = await Reminder.find()
    return reminenders.length
  }

  async updateReminderStatusToSentAsTrue(reminderId) {
    return Reminder.findByIdAndUpdate(reminderId, { sent: true })
  }

  async getRemindersNotSend({ limit, skip }) {
    return Reminder
      .find({ sent: false })
      .skip(skip)
      .limit(limit)
  }


}

module.exports = new MongoService()