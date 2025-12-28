const db = require('../config/db');

exports.getAllExpenses = async (req, res) => {
    try {
        const { user_id, category, start_date, end_date } = req.query;
        let query = `
      SELECT e.id, e.user_id, e.category as category_id, e.amount, e.date, e.description,
             u.name as user_name, c.name as category_name
      FROM Expenses e
      LEFT JOIN Users u ON e.user_id = u.id
      LEFT JOIN Categories c ON e.category = c.id
      WHERE 1=1
      
    `;
        const params = [];

        if (user_id) {
            params.push(user_id);
            query += ` AND e.user_id = $${params.length}`;
        }
        if (category) {
            params.push(category);
            query += ` AND e.category = $${params.length}`;
        }
        if (start_date) {
            params.push(start_date);
            query += ` AND e.date >= $${params.length}`;
        }
        if (end_date) {
            params.push(end_date);
            query += ` AND e.date <= $${params.length}`;
        }

        query += ' ORDER BY e.date DESC';

        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const { user_id, category, amount, date, description } = req.body;

        const query = 'INSERT INTO Expenses (user_id, category, amount, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const { rows } = await db.query(query, [user_id, category, amount, date, description || '']);

        res.status(201).json({ id: rows[0].id, user_id, category, amount, date, description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, category, amount, date, description } = req.body;
        const query = `
      UPDATE Expenses 
      SET user_id = $1, category = $2, amount = $3, date = $4, description = $5
      WHERE id = $6
    `;
        const result = await db.query(query, [user_id, category, amount, date, description, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM Expenses WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
