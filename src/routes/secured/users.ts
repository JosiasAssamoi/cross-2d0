import  prisma  from './../prisma'
import { Router, Request, Response } from 'express'

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
      res.status(200).json({})
    }
    else {
      res.status(400).json({ 'err': 'user inexistant' })
    }
  } catch (err) {
    res.status(400).json({})
  }
})


export default api
