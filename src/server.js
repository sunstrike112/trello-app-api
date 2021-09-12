import express from 'express'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environment'

const app = express()

connectDB().catch(console.log)

app.get('/', (req, res) => {
  res.end('<h1>Hello world uasascach</h1><hr/>')
})

app.listen(env.PORT, env.HOST, () => {
  console.log(`Hello james, i am running at ${env.HOST}:${env.PORT}/`)
})
