const express = require('express');
const router = express.Router();
const { Book } = require('../models');

// Route to list all books
router.get('/', async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
});

// Route to display form for creating a new book
router.get('/new', (req, res) => {
  res.render('new');
});

// Route to handle the submission of the form and create a new book
router.post('/', async (req, res) => {
  await Book.create(req.body);
  res.redirect('/books');
});

// Route to display form for editing an existing book
router.get('/:id/edit', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('edit', { book });
});

// Route to handle the submission of the form and update the book
router.post('/:id/edit', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books');
});

// Route to delete a book
router.post('/:id/delete', async (req, res) => {
  await Book.destroy({ where: { id: req.params.id } });
  res.redirect('/books');
});

module.exports = router;
