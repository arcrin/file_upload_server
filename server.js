import cors from 'cors'
import express from "express";
import initRoutes from './src/routes/index.js'

global.__basedir = process.cwd()
const app = express()

const corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))

app.use(express.urlencoded({
    extended: true
}))

initRoutes(app)

const port = 8080
app.listen(port, () => {
    console.log(`Running at localhost:${port}`)
})