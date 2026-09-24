const express = require('express');
const logger = require('morgan'); //run before request -> middleware
const postgresClient = require()

const app = express();

const userRoute = require('./routes/user');

// Middlewares, client -> middlewares -> server (xu li o controller)
app.use(logger('dev')); // log requests to the console

app.use('/users', userRoute); // Use the user route for /users endpoint

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
app.use(() => {
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
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

