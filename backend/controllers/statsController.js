const db = require('../config/db');

exports.getTop3Days = async (req, res) => {
    try {
        const query = `
      WITH DailyTotals AS (
          SELECT 
              u.name as user_name,
              e.user_id,
              e.date,
              SUM(e.amount) as total_spent
          FROM Expenses e
          JOIN Users u ON e.user_id = u.id
          GROUP BY e.user_id, u.name, e.date
      ),
      RankedDaily AS (
          SELECT 
              user_name,
              date,
              total_spent,
              ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total_spent DESC) as rank_val
          FROM DailyTotals
      )
      SELECT * FROM RankedDaily WHERE rank_val <= 3;
    `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMonthlyChange = async (req, res) => {
    try {
        const query = `
      SELECT 
          u.name as user_name,
          COALESCE(SUM(CASE WHEN TO_CHAR(e.date, 'YYYY-MM') = TO_CHAR(NOW(), 'YYYY-MM') THEN e.amount ELSE 0 END), 0) as current_month_spent,
          COALESCE(SUM(CASE WHEN TO_CHAR(e.date, 'YYYY-MM') = TO_CHAR(NOW() - INTERVAL '1 month', 'YYYY-MM') THEN e.amount ELSE 0 END), 0) as last_month_spent
      FROM Users u
      LEFT JOIN Expenses e ON u.id = e.user_id
      GROUP BY u.id
    `;
        const { rows } = await db.query(query);

        const processed = rows.map(row => {
            const current = parseFloat(row.current_month_spent);
            const last = parseFloat(row.last_month_spent);
            let percentage_change = 0;

            if (last === 0) {
                percentage_change = current > 0 ? 100 : 0;
            } else {
                percentage_change = ((current - last) / last) * 100;
            }

            return {
                user_name: row.user_name,
                current_month_spent: current,
                last_month_spent: last,
                percentage_change: parseFloat(percentage_change.toFixed(2))
            };
        });

        res.json(processed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPrediction = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.name as user_name,
                COALESCE(SUM(e.amount), 0) as total_last_3_months
            FROM Users u
            LEFT JOIN Expenses e ON u.id = e.user_id AND e.date >= CURRENT_DATE - INTERVAL '3 months'
            GROUP BY u.id, u.name
        `;
        const { rows } = await db.query(query);

        const predictions = rows.map(row => ({
            user_name: row.user_name,
            predicted_next_month: parseFloat((row.total_last_3_months / 3).toFixed(2))
        }));

        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
