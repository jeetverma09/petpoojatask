const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM Users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
