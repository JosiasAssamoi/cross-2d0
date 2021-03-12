import  PrismaSingleton  from './../prisma'
import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import {isEmpty} from 'lodash'

const prisma = PrismaSingleton.getInstance()
const api = Router()



api.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params 
  try {
    id 
    const user = await prisma.user.findUnique({
      where: {
        id : parseInt(id)
      },
    })

    if (user) {
      res.status(200).json({user})
    }
    else {
      res.status(400).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(400).json({err})
  }
})

api.put('/:id/', async (req: Request, res: Response) => {

  const fields = ['firstname', 'lastname']
  try {
    const { id } = req.params

    const missings = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { firstname, lastname } = req.body
    const user = await prisma.user.findUnique({
      where: {
        id : parseInt(id)
      },
    })

    if (user) {
      let data = {}
      if (req.body.password) {
        data["password"] = bcrypt.hashSync(req.body.password, 8)
      }
      data["firstname"] = firstname
      data["lastname"] = lastname

      const updatedUser = await prisma.user.update({
        where: {
          email: user.email,
        },
        data
      })

      res.status(200).json({updatedUser})
    }
    else {
      res.status(404).json({ 'err': 'user inexistant' })
    }

  } catch (err) {
    res.status(404).json({err})
  }
})

api.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id : parseInt(id)
      },
    })

    if (user) {
      await prisma.user.delete({
        where: {
          id : parseInt(id)
        },
      })

      res.status(200).json({user})
    }
    else {
      res.status(404).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(404).json({err})
  }
})






export default api
