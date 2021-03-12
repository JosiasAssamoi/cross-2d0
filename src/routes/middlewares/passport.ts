import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import PrismaSingleton from './../prisma'

const prisma = PrismaSingleton.getInstance()
dotenv.config()

/**
 * Local strategy
 */
function checkPassword(uncryptedPassword: string, password:string): boolean {
    
  return bcrypt.compareSync(uncryptedPassword, password)
}
 
 


passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, next) => {
      try {

         const user = await prisma.user.findUnique({
          where: {
            email
          },
        })

        if (!user) {
          next(`Sorry, login is incorrect 💩💩`, null)
          return
        }
        
        if (!checkPassword(user.encryptedPassword,password)){
          next(`Sorry, login is incorrect 💩💩`, null)
          return
        }


        next(null, user)
      } catch (err) {
        next(err.message)
      }
    }
  )
)

/**
 * JSON Web Token strategy
 */

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ENCRYPTION as string,
    },
    async (jwtPayload, next) => {
      try {
        const { id } = jwtPayload

        const user = await prisma.user.findUnique({
          where: {id
          },
        })

        if (!user) {
          next(`User ${id} doesn't exist`)
          return
        }

        next(null, user)
      } catch (err) {
        next(err.message)
      }
    }
  )
)
