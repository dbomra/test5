const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config(); // Ensure you have dotenv installed and configured

// Initialize Express application
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Sequelize with error handling
let sequelize;
try {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, // Correctly reference the environment variable
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  // Test the database connection
  sequelize.authenticate().then(() => {
    console.log('Connection to the database has been established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
} catch (error) {
  console.error('Error initializing Sequelize:', error);
}

// Define the Book model
const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Sync the database
sequelize.sync().then(() => {
  console.log('Database synced successfully.');
}).catch(err => {
  console.error('Error syncing database:', err);
});

// Import routes
const bookRoutes = require('./routes/books');

// Use the routes
app.use('/books', bookRoutes);

// Add a root route to redirect to /books
app.get('/', (req, res) => {
  res.redirect('/books');
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
