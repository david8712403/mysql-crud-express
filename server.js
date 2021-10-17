require('dotenv').config()
const mysql = require('mysql')
const express = require('express')

const app = express()
const port = 3000

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}
const db = mysql.createConnection(config);

db.connect((err) => {
    if (err)
        console.log(JSON.stringify(err));
    else
        console.log("Connect to database successful");
})

app.use(express.json())

app.get('/', (req, res) => {
    res.json("MySQL CRUD practice")
})

// CREATE
app.put('/task', (req, res) => {
    const { title, description, datetime } = req.body
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const sql = `INSERT INTO task (title, description, datetime, created, updated)
    VALUES ('${title}', '${description}', '${datetime}', '${now}', '${now}')`
    db.query(sql, (err, results) => {
        if (err) {
            res.status = 400
            res.json({ error: err })
            return
        }
        res.sendStatus(201)
    })
})

// READ
app.get('/task', (req, res) => {
    db.query('SELECT * FROM task', (err, results, fields) => {
        if (err) {
            res.status = 400
            res.json({ error: err })
            return
        }
        res.status = 200
        res.json(results)
    })
})

app.get('/task/:id', (req, res) => {
    const { id } = req.params
    db.query(`SELECT * FROM task WHERE id=${id}`, (err, results, fields) => {
        if (err) {
            res.status = 400
            res.json({ error: err })
            return
        }
        res.status = 200
        res.json(results)
    })
})

// UPDATE
app.patch('/task/:id', (req, res) => {
    const { id } = req.params
    const { title, description, datetime } = req.body
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const sql = `UPDATE task
        SET title = '${title}',
        description = '${description}',
        datetime = '${datetime}',
        updated = '${now}'
        WHERE id = ${id}`
    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status = 400
            res.json({ error: err })
            return
        }
        res.sendStatus(204)
    })
})

// DELETE
app.delete('/task/:id', (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM task WHERE id = ${id}`
    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status = 400
            res.json({ error: err })
            return
        }
        res.sendStatus(204)
    })
})

app.listen(port, () => {
    console.log(`server run on port ${port}...`);
})