const express = require('express');
const expenseRouter = express.Router();
const db = require('./db');

const getExpenses = (req, res, next) => {
    const email = req.body.email || req.query.email;

    

    db.query('SELECT * FROM expenses WHERE email = $1 ORDER BY name ASC', [email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).json(data.rows);
    });
}

const getExpenseById = (req, res, next) => {
    const id = parseInt(req.params.id);
    const email = req.body.email || req.query.email;

    db.query('SELECT * FROM expenses WHERE id=$1 AND email = $2', [id, email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).json(data.rows);

    });
}

const addExpense = (req, res, next) => {
    const { name, planned, actual, email } = req.body;

    db.query('INSERT INTO expenses (name, planned, actual, email) VALUES ($1, $2, $3, $4) RETURNING *', [name, planned, actual, email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(201).send(`Added expense with ID: ${data.rows[0].id} ${email}`);
    });
}

const updateExpense = (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, planned, actual } = req.body;

    db.query('UPDATE expenses SET name = $1, planned = $2, actual = $3 WHERE id=$4', [name, planned, actual, id], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).send(`Expense updated with ID: ${id}`);
    });
}

const deleteExpense = (req, res, next) => {
    const id = parseInt(req.params.id);
    const { email } = req.body;

    db.query('DELETE FROM expenses WHERE id = $1 AND email = $2', [id, email], (err, data) => {
        if(err) {
            throw err;
        }

        res.status(200).send(`Expense deleted with ID: ${id}`);
    })
}

expenseRouter.get('/', getExpenses);
expenseRouter.get('/:id', getExpenseById);
expenseRouter.post('/', addExpense);
expenseRouter.put('/:id', updateExpense);
expenseRouter.delete('/:id', deleteExpense);

module.exports = expenseRouter;