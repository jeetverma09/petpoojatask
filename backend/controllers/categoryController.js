const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM Categories');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
