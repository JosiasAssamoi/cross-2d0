import { Router } from 'express'
import passport from 'passport'
import secured from './secured'
import './middlewares/passport'
import signup from './signup'



const api = Router()

api.get("/",(_,res) =>{
    res.send('Hello from Api =)')
})

api.use('/signup',signup)
api.use(passport.initialize())
api.use('/', passport.authenticate('jwt', { session: false }), secured)


export default api