require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 5000;

app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'website'
})

connection.connect();

app.get("/api", (req, res) => {
    const selectAllRows = `SELECT * FROM accounts_notify WHERE email = '${req.query.email}';`; //Select query
    connection.query(selectAllRows, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    })
});


app.post("/api", (req, res) => {
    const row = req.body.row;
    const insertRowRequest = `INSERT INTO accounts_notify (email, class_name, class_sections) VALUES ('${row.email}', '${row.class_name.toUpperCase()}', '${row.class_sections}');`; //Insert query
    connection.query(insertRowRequest, (err, rows) => {
        if (err) throw err;
        console.log("inserted " + row);
    })

    res.send({ message: "Post sucessfull!" });

})

app.delete("/api", (req, res) => {

    connection.query(`SELECT * FROM accounts_notify WHERE id = ${req.query.id};`, (err, rows) => {
        if (err) throw err;
        if(req.query.email === rows[0].email) {
            const deleteRowRequest = `DELETE FROM accounts_notify WHERE id = ${req.query.id};`; //Delete query
            connection.query(deleteRowRequest, (err, rows) => {
                if (err) throw err;
                console.log("deleted " + req.query.id);
            })

            res.send({ message: "Delete sucessfull!" });
        }
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`));