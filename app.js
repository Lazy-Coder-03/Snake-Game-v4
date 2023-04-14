const express = require('express')
const path = require('path')

const app = express()

app.use(express.static('./public'))
app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname, './game/index.html'))
})

app.all('*', (req, res)=>{
    res.status(404).send('resource not found')
})

app.listen(8800, ()=>{
    console.log('server is listening on port 8800...')
})