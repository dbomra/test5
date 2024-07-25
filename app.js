const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Express application
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Sequelize
const sequelize = new Sequelize('dbomra.db', 'dbomra.db_owner', 'LChyYAsSj6m3', {
  host: 'ep-sweet-waterfall-a5vj5vn5.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Define the Book model
const Book = sequelize.define('Book', {
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  year: DataTypes.INTEGER
});

// Sync the database
sequelize.sync();

// Import routes
const bookRoutes = require('./routes/books');

// Use the routes
app.use('/books', bookRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
