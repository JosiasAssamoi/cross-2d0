import PrismaSingleton from './../prisma'
import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { isEmpty } from 'lodash'
import error from '../../utils/error'

const prisma = PrismaSingleton.getInstance()
const api = Router()


// USER CRUD

api.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    id
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      },
    })

    if (user) {
      res.status(200).json({ user })
    }
    else {
      res.status(400).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(400).json(error(err))
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
        id: parseInt(id)
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

      res.status(200).json({ updatedUser })
    }
    else {
      res.status(404).json({ 'err': 'user inexistant' })
    }

  } catch (err) {
    res.status(404).json(error(err))
  }
})

api.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      },
    })

    if (user) {
      await prisma.user.delete({
        where: {
          id: parseInt(id)
        },
      })

      res.status(200).json({ user })
    }
    else {
      res.status(404).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(404).json(error(err))
  }
})


//User task CRUD 

api.get('/:id/tasks', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where:
      {
        id: parseInt(req.params.id)
      },
      include: { tasks: true }
    })
    if (user) {
      res.status(200).json({ tasks: user.tasks })
    }
    else {
      res.status(404).json({ err: 'User non trouvé' })
    }
  }
  catch (err) {
    res.status(404).json(error(err))
  }

})

api.post('/:id/tasks', async (req, res) => {
  const fields = ['content']
  try {
    const { id } = req.params
    const missings = fields.filter((field: string) => !req.body[field])
    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }
    const { content } = req.body
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })

    if (user) {
      const data = { isComplete: false, content, userId: user.id }
      const task = prisma.task.create({
        data
      })
      res.status(200).json({ task })
    }
    else {
      res.status(404).json({ err: 'User non trouvé' })
    }
  }
  catch (err) {
    res.status(404).json(error(err))
  }

})


api.put('/:id/tasks/:taskId', async (req, res) => {
  const { id, taskId } = req.params
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (user) {
      const task = await prisma.task.findUnique({ where: { id: parseInt(taskId) } })
      if (task) {
        let data = {}
        if (req.body.content) {
          data['content'] = req.body.content
        }
        if (req.body.isComplete) {
          data["isComplete"] = req.body.isComplete
        }
        const taskUpdated = prisma.task.update({
          where: { id: parseInt(taskId) },
          data
        })
        res.status(200).json({ taskUpdated })
      }
      else {
        res.status(400).json({ err: "tache inexistante" })
      }

    }
    else {
      res.status(404).json({ err: 'User non trouvé' })
    }
  }
  catch (err) {
    res.status(404).json(error(err))
  }

})


api.delete('/:id/tasks/:taskId', async (req, res) => {
  const { id, taskId } = req.params
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (user) {
      const task = await prisma.task.findUnique({ where: { id: parseInt(taskId) } })
      if (task) {
        const deleted = prisma.task.delete({
          where: { id: parseInt(taskId) }
        })
        res.status(200).json({ deleted })
      }
      else {
        res.status(400).json({ err: "tache inexistante" })
      }

    }
    else {
      res.status(404).json({ err: 'User non trouvé' })
    }
  }
  catch (err) {
    res.status(404).json(error(err))
  }

})





export default api
