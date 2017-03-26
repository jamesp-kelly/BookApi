var bookController = function(BookModel) {

  var post = function(req, res) {
    var book = new BookModel(req.body);

    if (!req.body.title) {
      res.status(400);
      res.send('Title is required');
    } else {
      book.save();
      res.status(201);
      res.send(book); 
    }
  };

  var get = function(req, res) {
    var query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    BookModel.find(query, function(err, books) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(books);
      }
    });
  };

  return {
    post: post,
    get: get
  }

};

module.exports = bookController;