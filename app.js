
const express = require('express')
const fs = require('fs')
const mysql = require('mysql2');
const app = express()
const port = 3001
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const bodyParser = require('body-parser')
const io = new Server(httpServer, { });

io.on("connection", (socket) => {
    console.log("Connection")
});




// reponse a un message dans le bot

// client.on('message',async message => {
//     console.log('Un nouveau message', message)
//     if (message.author.bot)return;{
//         message.reply('Oui ')
        
//     }
  
// })




client.on('message',async message => {

//pour creer un film il suffit juste faire : !!Create nom_film

    if (!message.author.bot && message.content.substring(0,9) === "!!Create "){
       

        message.reply("Vous avez ajouté le film : " + message.content.substring(9, message.content.length))

        connection.query(`INSERT INTO films (id_genre, id_distributeur, titre, resum, date_debut_affiche, date_fin_affiche, duree_minutes, annee_production) VALUES (1, 1, ?, 'Resumé', '2022-06-05', '2030-06-05', 129, 2022)`,[ message.content.substring(9, message.content.length)])

        console.log('Le Film a été crée')

    }

    //pour modifier un film il suffit juste faire :  !!Update -(id_film) -nouveau nom_film
  
    else if(!message.author.bot && message.content.substring(0,9) === "!!Update "){

        message.reply("Vous avez changer le nom du film, Le id & nouveau titre est : " + message.content.substring(9, message.content.length))

        let Tab = message.content.split("-")

        connection.query(`UPDATE films SET titre = ? WHERE id_film = ?`,[Tab[2],Tab[1]])

        console.log('Le Titre a été modifié')
    }

    //pour supprimer un film il suffit juste faire : !!Delete (id_film)

    else if(!message.author.bot && message.content.substring(0,9) === "!!Delete ")
    {
        message.reply("Vous avez supprimer le film où son id  est : " + message.content.substring(9, message.content.length))

        connection.query(`DELETE FROM films WHERE id_film = ?`,[message.content.substring(9, message.content.length)])

        console.log('Le Film a été supprimée')

    }
    
     
    
})  






app.use(bodyParser.json())


console.log("okokok")
app.set('view engine', 'ejs')

//connexion a la db

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cinema',
    password : 'tiger',
});
  

app.get('/films', (req, res) => {

    connection.query(`SELECT * FROM films`, (err, results, fields) => {
        res.render('films', {
            films: results
        })
    })
    
})

app.get('/films/:id', (req, res) => {
    let id = req.params.id

    connection.query(`SELECT * FROM films WHERE id_film = ?`, [id], (err, results, fields) => {
        console.log(results)
        res.render('film', {
            film: results[0]
        })
    })

})

app.delete('/api/films/:id', (req, res) => {
    let id = req.params.id

    connection.query(`DELETE FROM films WHERE id_film = ?`, [id], (err, results, fields) => {
        res.json({status: 200, data: "Success"})

        io.emit("film-delete", id)

    })

})

app.post('/api/films', (req, res) => {
    
    console.log(req.body) // $_POST
    console.log(req.query) // $_GET
    console.log(req.params) // Pas d'équivalent

    connection.query(`
        INSERT INTO films 
        (id_genre, id_distributeur, titre, resum, date_debut_affiche, date_fin_affiche, duree_minutes, annee_production) 
        VALUES 
        (1, 1, ?, 'Resumé', '2003-07-20', '2300-08-27', 129, 2003)`, 
    [ req.body.titre ], (err, results, fields) => {
        res.json({status: 200, data: "Success"})

        connection.query(`SELECT * FROM films WHERE id_film = ?`, [results.insertId], (err, results, fields) => {
            io.emit("film-create", results[0])
        })

    })

})

// app.post('/hello', (req, res) => {
//     res.send('Hello World! Hello World! Hello World!')
// })
 
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

client.login('OTc0NjEyNzA3MTM3NDQ5OTk1.GdSz-0.z7t-ZIQBU-CBGfBb2yrPfHENKX9jZ-u4bUHWo0')

httpServer.listen(port);