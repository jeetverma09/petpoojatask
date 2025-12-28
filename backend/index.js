const express = require('express');
const cors = require('cors');

const expenseRoutes = require('./routes/expenses');
const statsRoutes = require('./routes/stats');
const masterRoutes = require('./routes/master');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/master', masterRoutes);

app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
