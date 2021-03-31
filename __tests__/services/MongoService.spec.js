const MongoService = require('../../src/services/mongoService')
const Reminder = require('../../src/schemas/reminder')

describe('MongoService test', () => {

  it("Should Verify if create method was called inside MongoService with correct params", async () => {

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


  it("Should return an error if title is not sent", async () => {

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



})