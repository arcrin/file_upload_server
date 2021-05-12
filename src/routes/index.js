import express, {Router} from 'express'
import controller from '../controller/file.controller.js'

const router = Router()

const routes = (app) => {
    router.post('/upload', controller.upload)
    router.get('/files', controller.getListFiles)
    router.get('/files/:name', controller.download)
    app.use(router)
}

export default routes