const MongoService = require('../../src/services/mongoService')
const Reminder = require('../../src/schemas/reminder')
const { Types } = require('mongoose')

describe('MongoService test', () => {

  it("Should verify if create method was called inside MongoService with correct params", async () => {

    const createdMethod = jest.spyOn(Reminder, 'create').mockImplementationOnce(() => new Promise(resolve => resolve()))

    const data =
    {
      title: 'some-tile',
      description: 'some-description',
      due_date: 'some-date',
      value: 'some-value',
      userId: 'user-id'
    }

    await MongoService.saveReminder(data)

    expect(createdMethod).toBeCalledWith(data)

  })


  it("Should return an error if title param is not provided", async () => {

    jest.spyOn(Reminder, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const data =
    {
      description: 'some-description',
      due_date: 'some-date',
      value: 'some-value',
      userId: 'user-id'
    }

    const promise = MongoService.saveReminder(data)
    expect(promise).rejects.toThrow()

  })

  it("Should return an error if description param is not provided", async () => {

    jest.spyOn(Reminder, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const data =
    {
      title: 'some-tile',
      due_date: 'some-date',
      value: 'some-value',
      userId: 'user-id'
    }

    const promise = MongoService.saveReminder(data)
    expect(promise).rejects.toThrow()

  })

  it("Should create a reminder", async () => {

    jest.spyOn(Reminder, 'create')
      .mockImplementationOnce(() => new Promise(resolve => {
        const remanderSaved = {
          _id: 'some-id',
          title: 'some-tile',
          description: 'some-description',
          due_date: 'some-date',
          value: 'some-value',
          userId: 'user-id'
        }
        resolve(remanderSaved)

      }))

    const data =
    {
      title: 'some-tile',
      description: 'some-description',
      due_date: 'some-date',
      value: 'some-value',
      userId: 'user-id'
    }

    const response = await MongoService.saveReminder(data)


    expect(response._id).toBeTruthy()
    expect(response.title).toEqual(data.title)

  })



  it("Should return all Reminders not sent length", async () => {

    jest.spyOn(Reminder, 'find').mockReturnValueOnce(new Promise((resolve, reject) => resolve([])))

    const remendersLength = await MongoService.getAllRemindersNotSentLength()

    expect(remendersLength).toBe(0)

  })

  it("Should verify is findByIdAndUpdate was called with correct Params", async () => {

    const findByIdAandUpdateMethod = jest.spyOn(Reminder, 'findByIdAndUpdate').mockReturnValueOnce(new Promise((resolve, reject) => resolve()))

    const userId = Types.ObjectId()
    const updatedStatus = { sent: true }
    await MongoService.updateReminderStatusToSentAsTrue(userId)


    expect(findByIdAandUpdateMethod).toBeCalledWith(userId, updatedStatus)

  })

  it("Should verify is getRemindersNotSend was called with correct Params", async () => {


    //jest.fn() mocka uma função

    const limit = jest.fn(() => new Promise(resolve => resolve()))

    const skip = jest.fn(() => ({ limit }))

    const findMock = jest.fn(() => ({ skip }))


    const findMethodMock = jest.spyOn(Reminder, 'find').mockImplementation(findMock)

    const updatedStatusSent = { sent: false }


    const skipValue = 2
    const limitValue = 10

    await MongoService.getRemindersNotSend({ limit: limitValue, skip: skipValue })


    expect(findMethodMock).toBeCalledWith(updatedStatusSent)

    expect(skip).toBeCalledWith(skipValue)

    expect(limit).toBeCalledWith(limitValue)

  })





})