import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'

//Define Card collection
const cardCollectionName = 'cards'
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(), //aslo ObjectId when create new
  columnId: Joi.string().required(),//aslo ObjectId when create new
  title: Joi.string().required().min(3).max(30).trim(),
  cover: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
})

const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, {
    abortEarly: false,
  })
}

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)
    const insertValue = {
      ...validatedValue,
      boardId: ObjectId(validatedValue.boardId),
      columnId: ObjectId(validatedValue.columnId)
    }
    const result = await getDB().collection(cardCollectionName).insertOne(insertValue)

    return await getDB().collection(cardCollectionName).findOne(result.insertedId)
  } catch (error) {
    throw new Error(error)
  }
}


/**
 * 
 * @param { Array of string card id } ids
 */
const deleteMany = async (ids) => {
  try {
    const transformIds = ids.map(i => ObjectId(i))

    const result = await getDB().collection(cardCollectionName).updateMany(
      { _id: { $in: transformIds } },
      { $set: { _destroy: true } }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    if (data.boardId) {
      updateData.boardId = ObjectId(data.boardId)
    }
    if (data.columnId) {
      updateData.columnId = ObjectId(data.columnId)
    }

    const result = await getDB().collection(cardCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const CardModel = {
  createNew,
  cardCollectionName,
  deleteMany,
  update
}
