import uploadFile from "../middleware/upload.js"
import fs from 'fs'
import csv from 'csv-parser'

const baseUrl = "http://localhost:8080/files/";

const upload = async (req, res) => {
    try {
        const sn_list = []
        await uploadFile(req, res)

        if (req.file == undefined) {
            return res.status(400).send({message: "Please upload a file!"})
        }
        console.log(req.file.originalname)

        const directoryPath = __basedir + '/resources/static/assets/uploads/'
        fs.createReadStream(directoryPath + req.file.originalname)
            .pipe(csv())
            .on('data', (row) => {
                let sn = row.SN
                if (sn.length > 6) {
                    sn_list.push(sn.slice(0,6) + '/' + sn.slice(6, 10))
                }
        })
            .on('end', () => {
                console.log('CSV file parsed')
            })

        res.status(200).json(sn_list)
    } catch (err) {
        console.log(err)
        if(err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!"
            })        }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`
        })
    }
}

const getListFiles = (req, res) => {
    const directoryPath = __basedir + '/resources/static/assets/uploads/'

    fs.readdir(directoryPath, (err, files) => {
        if(err) {
            res.status(500).send({
                message: 'Unable to scan files!'
            })
        }
        const fileInfos = []
        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file
            })
        })
        res.status(200).send(fileInfos)
    })
}

const download = (req, res) => {
    const fileName = req.params.name
    const directoryPath = __basedir + '/resources/static/assets/uploads/'
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: 'Could not download the file.' +err
            })
        }
    })
    fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}

export default {
    upload,
    getListFiles,
    download
}