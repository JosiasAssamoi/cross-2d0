import express from 'express'
import dotenv from "dotenv"
import api from './routes'

const main = () => {
  if (process.env.DATABASE_URL && process.env.JWT_ENCRYPTION) {
    dotenv.config()
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api', api)

    

    app.listen(3000, () =>
      console.log(
        '🚀 Server runnning at: http://localhost:3000 ⭐️ ',
      ),
    )
  }
  else {
    if(process.env.JWT_ENCRYPTION == undefined){
      throw new Error("Missing JWT_ENCRYPTION in env file")
    }
    else{
      throw new Error("Missing DATABASE_URL in env file")
    }
  }
}


// & merci 😎😎😎 //
main()

