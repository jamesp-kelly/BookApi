var express = require('express');

var routes = function(BookModel) {
  var bookRouter = express.Router();

  var bookController = require('../controllers/bookController')(BookModel);

  bookRouter.route('/')
    .post(bookController.post)
    .get(bookController.get);

  //middleware
  bookRouter.use('/:bookId', function(req, res, next) {
    BookModel.findById(req.params.bookId, function(err, book) {
      if (err) {
        res.status(500).send(err);
      } else if (book) {
        req.book = book;
        next();
      } else {
        res.status(404).send('no book found');
      }
    });
  });

  bookRouter.route('/:bookId')
    .get(getByBookId)
    .put(putByBookId)
    .patch(patchBookById)
    .delete(deleteBookById);

  function getByBookId(req, res) {
    //middleware called before here

    var returnBook = req.book.toJSON();
    returnBook.links = {};
    var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre; 
    returnBook.links.FilterByThisGenre = encodeURI(newLink);

    res.json(returnBook);
  }

  function putByBookId(req, res) {
    req.book.title = req.body.title;
    req.book.author = req.body.author;
    req.book.genre = req.body.genre;
    req.book.read = req.body.read;
    req.book.save(function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.book);
      }
    });
  }

  function patchBookById(req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    for(var p in req.body) {
      req.book[p] = req.body[p];
    }

    req.book.save(function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.book);
      }
    });
  }

  function deleteBookById(req, res) {
    req.book.remove(function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send('Removed');
      }
    });
  }

    return bookRouter;
};

module.exports = routes;