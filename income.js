const express = require('express');
const incomeRouter = express.Router();
const db = require('./db');

const getIncome = (req, res, next) => {
    db.query('SELECT * FROM income ORDER BY name ASC', (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).json(data.rows);
    });
}

const getIncomeById = (req, res, next) => {
    const id = parseInt(req.params.id);

    db.query('SELECT * FROM income WHERE id=$1', [id], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).json(data.rows);
    });
}

const addIncome = (req, res, next) => {
    const { name, planned, actual } = req.body;

    db.query('INSERT INTO income (name, amount) VALUES ($1, $2) RETURNING *', [name, planned, actual], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(201).send(`Added income with ID: ${data.rows[0].id}`);
    });
}

const updateIncome = (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, planned, actual } = req.body;

    db.query('UPDATE income SET name = $1, amount = $2 WHERE id=$3', [name, planned, actual, id], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).send(`Income updated with ID: ${id}`);
    });
}

const deleteIncome = (req, res, next) => {
    const id = parseInt(req.params.id);

    db.query('DELETE FROM income WHERE id = $1', [id], (err, data) => {
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