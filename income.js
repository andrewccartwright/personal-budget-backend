const express = require('express');
const incomeRouter = express.Router();
const db = require('./db');

const getIncome = (req, res, next) => {
    const { email } = req.body;

    db.query('SELECT * FROM income WHERE email = $1 ORDER BY name ASC', [email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).json(data.rows);

    });
}

const getIncomeById = (req, res, next) => {
    const id = parseInt(req.params.id);
    const { email } = req.body;

    db.query('SELECT * FROM income WHERE id=$1 AND email = $2', [id, email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).json(data.rows);

    });
}

const addIncome = (req, res, next) => {
    const { name, planned, actual, email } = req.body;

    db.query('INSERT INTO income (name, planned, actual) VALUES ($1, $2, $3, $4) RETURNING *', [name, planned, actual, email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(201).send(`Added income with ID: ${data.rows[0].id}`);
    });
}

const updateIncome = (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, planned, actual } = req.body;

    db.query('UPDATE income SET name = $1, planned = $2, actual = $3 WHERE id=$4', [name, planned, actual, id], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).send(`Income updated with ID: ${id}`);
    });
}

const deleteIncome = (req, res, next) => {
    const id = parseInt(req.params.id);
    const { email } = req.body;

    db.query('DELETE FROM income WHERE id = $1 AND email = $2', [id, email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).send(`Income deleted with ID: ${id}`);
    })
}

incomeRouter.get('/', getIncome);
incomeRouter.get('/:id', getIncomeById);
incomeRouter.post('/', addIncome);
incomeRouter.put('/:id', updateIncome);
incomeRouter.delete('/:id', deleteIncome);

module.exports = incomeRouter;