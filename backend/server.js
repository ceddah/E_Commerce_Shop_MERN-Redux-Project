const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Handle uncaught exception errors
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Uncaught Exception.');
    process.exit(1);
})
// env config
dotenv.config({ path: 'backend/config/config.env' });

// DB Connection 
connectDatabase();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection.');
    server.close(() => {
        process.exit(1);
    });
});