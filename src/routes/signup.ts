import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import PrismaSingleton from './prisma'
import { Gender } from '../utils/const/gender'
import error from '../utils/error'

const prisma = PrismaSingleton.getInstance()


const api = Router()


api.post('/', async (req: Request, res: Response) => {
  const fields = ['firstname', 'lastname', 'birthdate', "gender", 'email', 'password', 'passwordConfirmation']
  try {
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }
    const { firstname, lastname, password, email, passwordConfirmation, gender } = req.body

    if (password !== passwordConfirmation) {
      throw new Error("Password doesn't match")
    }
    if (!Object.values(Gender).includes(gender)) {
      throw new Error("Unknown gender")
    }
    const encryptedPassword = bcrypt.hashSync(password, 8)
    const birthdate = new Date(req.body.birthdate)
    const user = await prisma.user.create({
      data: {
        email,
        lastname,
        firstname,
        birthdate,
        gender,
        encryptedPassword,
      },
    })
    const payload = { id: user.id, firstname }
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
    res.status(200).json({ user: payload, token })
  } catch (err) {
    res.status(404).json(error(err))
  }
})


export default api
