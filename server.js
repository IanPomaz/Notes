const express = require('express');
const fs = require('fs');
const path = require('path')
const app = express()
const {v4:uuidv4} = require('uuid')
const PORT = process.env.PORT||3001
var mongoose = require('mongoose');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cluster0');

app.get('/', (rec,res)=>{
    res.sendFile(path.join(__dirname,"/public/index.html"))
})

app.get('/notes', (rec,res)=>{
    res.sendFile(path.join(__dirname,"/public/notes.html"))
})

app.get('/api/notes', (rec,res)=>{
    fs.readFile('db/db.json','utf8',(err,data)=>{
        if(err){
            console.error(err)
            res.status(500).send('Broken')
        }
        try{
            const notes=JSON.parse(data)
            res.json(notes)
        } catch(parseError){
            console.error(parseError)
            res.status(500).send('Error')
        }
    })
})
app.post('/api/notes', (rec,res)=>{
    const newNote = rec.body
    newNote.id = uuidv4()
    fs.readFile('db/db.json','utf8',(err,data)=>{
        if(err){
            console.error(err)
            res.status(500).send('Broken')
            return
        }
        try{
            const notes = JSON.parse(data)
            notes.push(newNote)
            fs.writeFile('db/db.json', JSON.stringify(notes),(err)=>{
                if(err){
                    console.error(err)
                    res.status(500).send('Broken')
                    return
                }
                res.status(200).send('note added successfully!')
            })
        }catch(err){
            console.error(err)
            res.status(500).send('error')
        }
    })
})
app.listen(PORT, () => console.log(`app.listening: ${PORT}`))