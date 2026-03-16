import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import { reqLogger } from './middleware/reqLoggerMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2100;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use(reqLogger);

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('File Sharing Platform API');
});

// 404 - Not Found handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Sync database and start server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync({ alter: true });
        console.log('Database synchronized');

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
