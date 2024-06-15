require('dotenv').config();
const oracledb = require('oracledb');
const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());


async function performOperation(operation) {
    try {
        // Use the connection string copied from the cloud console
        // and stored in connstring.txt file from Step 2 of this tutorial
        const connection = await oracledb.getConnection({ user: process.env.DB_USER, password: process.env.DB_PASS, connectionString: process.env.DB_STRING});
        const result = await connection.execute(operation, {}, {
            autoCommit: true
        });
        return result;
    }
    catch (err) {
        console.error(err);
    }
}


app.get("/api", (req, res) => {
    const selectAllRows = `SELECT * FROM REACT.ACCOUNTS_NOTIFY WHERE EMAIL = '${req.query.email}'`; //Select query
    performOperation(selectAllRows).then((result) => {
        res.send(result.rows)
    }).catch((error) => {
        console.error(error);
    })
});


app.post("/api", (req, res) => {
    const row = req.body.row;
    const insertRowRequest = `INSERT INTO REACT.accounts_notify (email, class_name, class_sections, campus) VALUES ('${row.email}', '${row.class_name.toUpperCase()}', '${row.class_sections}', '${row.campus}')`; //Insert query
    performOperation(insertRowRequest).then((result) => {
        res.send({ message: "Insert sucessfull!" });
    }).catch((error) => {
        console.error(error);
    })

})

app.delete("/api", (req, res) => {


    performOperation(`SELECT * FROM REACT.accounts_notify WHERE id = ${req.query.id}`).then((result) => {
        if(req.query.email == result.rows[0][4]) {
            const deleteRowRequest = `DELETE FROM REACT.accounts_notify WHERE id = ${req.query.id}`; //Delete query
            performOperation(deleteRowRequest).then((deleteResult) => {
                res.send({ message: "Delete sucessfull!" });
            }).catch((error) => {
                console.error(error);
            })
        }  
    }).catch((error) => {
        console.error(error);
    })

})

app.listen(port, () => console.log(`Listening on port ${port}`));