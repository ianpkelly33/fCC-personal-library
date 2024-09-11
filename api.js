/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../model').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await Book.find({});
        if (!books) {
          res.json([]);
        };
        const result = books.map(book => {
          return {
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length
          };
        });
        res.json(result);
        return;
      } catch (err) {
        res.json([]);
      };
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      };
      const newBook = new Book({ title, comments: [] });
      try {
        const book = await newBook.save();
        res.json({ _id: book._id, title: book.title });
      } catch (err) {
        res.send('there was an error saving');
      };
    })
    
    .delete(async (req, res) => {
      try {
        const deleted = await Book.deleteMany();
        res.send('complete delete successful');
      } catch (err) {
        res.send('error');
      };
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });
      } catch (err) {
        res.send('no book exists');
      };
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.send('missing required field comment');
      };
      try {
        let book = await Book.findById(bookid);
        book.comments.push(comment);
        book = await book.save();
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });
      } catch (err) {
        res.send('no book exists');
      };
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      try {
        const deleted = await Book.findByIdAndDelete(bookid);
        if (!deleted) throw new Error('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      };
    });
  
};
