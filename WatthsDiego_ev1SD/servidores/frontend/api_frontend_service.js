#!/usr/bin/env

const express = require("express");
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "127.0.0.1";

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/:username-:password", verifyAunth, async (req, res) => {
    try {
        await fetch("http://127.0.0.1:3800")
        .then(rez => rez.json())
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
    } catch (error) {
        console.log(error.message);
    }
})

app.get("/vg/:username-:password-:title", verifyAunth, async (req, res) => {
    try {
        fetch(`http://127.0.0.1:3800/vg/${req.params.title}`)
        .then(rez => rez.json())
        .then(data => res.json(data))
        .catch(err => console.log(err.message));
    } catch (error) {
        console.log(error.message);
    }
})

app.post("/create/:username-:password", verifyAunth, async (req, res) => {
    try {
        const {title: tit, genre: gen, developers: dev, sales: money} = req.body;

        fetch("http://127.0.0.1:3800/create", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({
                "title": tit,
                "genre": gen,
                "developer": dev,
                "sales": money
            })
        }).then(rez => res.send(rez.message))
        .catch(err => console.log(err.message));
    } catch (error) {
        console.log(error.message);
    }
})

app.patch("/update/:username-:password-:title", verifyAunth, async (req, res) => {
    try {
        const {title: tit, genre: gen, developers: dev, sales: money} = req.body;

        fetch(`http://127.0.0.1:3800/update/${req.params.title}`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Methods": "PATCH, OPTIONS"
            },
            body: JSON.stringify({
                "title": tit,
                "genre": gen,
                "developer": dev,
                "sales": money
            })
        }).then(rez => res.send(rez.message))
        .catch(err => console.log(err.message));
    } catch (error) {
        console.log(error.message);
    }
})

app.delete("/delete/:username-:password-:title", verifyAunth, async (req, res) => {
    try {
        fetch(`http://127.0.0.1:3800/delete/${req.params.title}`, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Methods": "DELETE, OPTIONS"
            }
        }).then(rez => res.send(rez.message))
        .catch(err => console.log(err.message));
    } catch (error) {
        console.log(error.message);
    }
})

async function verifyAunth(req, res, next){
    try {
        const {username: user, password: pass} = req.params;
    
        fetch("http://127.0.0.1:3900/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({
                "username": user,
                "password": pass
            })
        }).then(rez => {
            if(rez.ok){
                next();
            }else{
                res.send("Not Aunthenticated. Please use an aunthenticated user");
                res.end()
            }
        }).catch(err => console.log(err.message))
    } catch (error) {
        console.log(error.message);
    }
}

app.listen(PORT, () => console.log(`Este servicio, el frontend, está en http://${HOST}:${PORT}`));