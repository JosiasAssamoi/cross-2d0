import { Router } from 'express'
import passport from 'passport'
import secured from './secured'
import './middlewares/passport'



const api = Router()

api.use('/signin')
api.use('signup')
api.use(passport.initialize())
api.use('/', passport.authenticate('jwt', { session: false }), secured)


export default api