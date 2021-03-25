const { Router } = require('express')
const moment = require('moment')
const momentTimeZone = require('moment-timezone')
const MongoService = require('../services/mongoService')
const remiderParserResponse = require('../parser/ReminderParserRespone')
const FirestoreService = require('../services/firestoreService')

const routes = Router()


routes.post('/create', async (req, res) => {

  const { title, description, due_date, value, userId } = req.body

  //const userId = req.userId

  try {

    if (!title || !description || !due_date || !userId || !value) return res.status(400).json({ message: 'Missing params' })

    const createdReminded = await MongoService.saveReminder({
      title,
      description,
      due_date,
      value,
      userId
    })

    const reminderResponse = remiderParserResponse(createdReminded)

    return res.status(201).json(reminderResponse)

  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})


/**
 * 1-) pegar de n em n lembrentes (paginação) [x]
 * 2-) verificar se esses lembrentes estão com datas para vencer (um dia antes) [x]
 * 3-) simular o enviao email para o usuário dono desse lembrete um alerta [x]
 * 
 */

routes.get('/verify-reminders-about-to-due', async (req, res) => {

  const reminderPerTimeToSend = 3

  const total_reminders = await MongoService.getAllRemindersNotSentLength()

  let timesToLoop = total_reminders


  const updateStatusRemindersPromises = []

  while (timesToLoop > 0) {

    const reminders = await MongoService.getRemindersNotSend({ skip: total_reminders === timesToLoop ? 0 : reminderPerTimeToSend, limit: reminderPerTimeToSend })

    const remindersToSendNotification = reminders.map(async (reminder) => {

      const today = momentTimeZone(new Date()).tz('America/Sao_Paulo')

      const futureDay = momentTimeZone(reminder.due_date).tz('America/Sao_Paulo')

      if (moment(futureDay).diff(today, 'days') === 1) {

        updateStatusRemindersPromises.push(new Promise(async (resolve, reject) => {

          try {
            await MongoService.updateReminderStatusToSentAsTrue(reminder._id)
            resolve()
          } catch (error) {
            reject(error)
          }
        }))

        const user = await FirestoreService.getUserById(reminder.userId)

        console.log(`Enviando email para ${user.email}, lembrete: Caro, ${user.name}, seu boleto se vence em
            ${momentTimeZone(reminder.due_date).tz('America/Sao_Paulo').format('llll')} exatamente daqui a ${moment(futureDay).diff(today, 'days')} dias
          `)

      }

      return null
    })

    await Promise.all(remindersToSendNotification)

    timesToLoop = timesToLoop - reminderPerTimeToSend
  }

  await Promise.all(updateStatusRemindersPromises)

  return res.send()

})



module.exports = routes