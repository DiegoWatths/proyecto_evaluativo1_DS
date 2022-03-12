#!/usr/bin/env

const express = require("express");
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3800;
const HOST = process.env.HOST || "127.0.0.1";
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/videogames"

const VideoGame = require("./models/videoGames")

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: "http://127.0.0.1:4000", // <-- location of the proxy server
    credentials: true,
}));

mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

//all
app.get("/", async (req, res) =>{
    try {
        const videogames = await VideoGame.find()
        console.log("Videogames collection is being sent...")
        res.json(videogames)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }  
})

//only 1
app.get("/vg/:title", getVideoGame, (req, res) =>{
    console.log("Videogame Found")
    res.json(res.videogame)
})

//Create videogames
app.post("/create", async (req, res) =>{
    const vg = new VideoGame({
        title: req.body.title,
        genre: req.body.genre,
        developers: req.body.developers,
        sales: req.body.sales,
    })

    try {
       await vg.save();

        const {title: tit, genre: gen, developers: dev, sales: money} = vg; //<- Destructure the object onto several constants
        console.log("New Videgame added:")
        console.table({title: tit, genre: gen, developers: dev, sales: money}); //<- Show the object in a table very fancy indeed

        res.status(201).send("Videogame added to database!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//update videogames collection
app.patch("/update/:title", getVideoGame, async (req, res) =>{
    if(req.body.title != null){
        console.log(`Changed the title ${res.videogame.title} to ${req.body.title}`);
        res.videogame.title = req.body.title;
    }

    if(req.body.genre != null){
        console.log(`Changed the genre ${res.videogame.genre} to ${req.body.genre}`);
        res.videogame.genre = req.body.genre;
    }

    if(req.body.developers != null){
        console.log(`Changed the developers ${res.videogame.developers} to ${req.body.developers}`);
        res.videogame.developers = req.body.developers;
    }

    if(req.body.sales != null){
        console.log(`Changed the sales ${res.videogame.sales} to ${req.body.sales}`);
        res.videogame.sales = req.body.sales;
    }

    try {
        await res.videogame.save();
        console.log("Videogame Updated:")

        const {title: tit, genre: gen, developers: dev, sales: money} = res.videogame;
        console.table({title: tit, genre: gen, developers: dev, sales: money})
        res.status(200).send("Videogame Updated Succesfully!")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//delete
app.delete("/delete/:title", getVideoGame, async (req, res) =>{
    try {
        await res.videogame.delete();
        console.log("Videogame Deleted T-T")
        res.status(400).json("Deleted Videogame :o oops...")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

async function getVideoGame(req, res, next) {
    let videogame
    try {
        console.log(req.params.id);
        videogame = await VideoGame.findOne({title: req.params.title});
        if (videogame == null) {
            return res.status(404).json({ message: "Cannot find Videogame"})
        }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.videogame = videogame
    next()
}

app.listen(PORT, () => console.log(`Este servicio, el backend, está en http://${HOST}:${PORT}`))