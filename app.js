import bodyParser from 'body-parser';
import express from 'express'; 
import logger from 'morgan';

const app = express();

import userRoute from './routes/user.js'; // userRoute là router, do export default nên có thể đổi tên
import cartRoute from './routes/cart.js';
import productRoute from './routes/product.js';
import orderRoute from './routes/order.js';

// Middlewares, client -> middlewares -> server (xu li o controller)
app.use(logger('dev')); // log requests to the console
app.use(bodyParser.json()); // parse incoming requests with JSON payloads

app.use('/users', userRoute); // Use the user route for /users endpoint
app.use('/cart', cartRoute); // Use the cart route for /cart endpoint
app.use('/products', productRoute); // Use the product route for /products endpoint
app.use('/orders', orderRoute); // Use the order route for /orders endpoint

// Routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Server is OK!'
    });
});

// Catch errors and forward to error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);  
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = error.status || 500;

    //response to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    });
});

// Start the server
const PORT = app.get('port') || 3000;

async function startServer() {
    try {
        console.log("✅ Connected to PostgreSQL");

        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error) {
        console.error(`❌ Failed to connect to PostgreSQL, error: ${error}`);
        process.exit(1); // Exit the process with an error code
    }
}

startServer();
