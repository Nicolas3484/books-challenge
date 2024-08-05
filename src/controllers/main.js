const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op } = require('sequelize')
const { validationResult } = require('express-validator')

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    // Implement look for details in the database
    const bookId = req.params.id;
    const user = req.session.userLogin;

  db.Book.findByPk(bookId, {
    include: [{ association: 'authors' }]
  })
    .then((book) => {
      if (!book) {
        return res.status(404).send('Book not found');
      }
      const category = user ? user.categoryId : 'User';
      res.cookie('userLogin')
      res.render('bookDetail', { book, category });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Data base error');
    });

  },
  bookSearch: (req, res) => {
    res.render('search', { books: []});
  },
  bookSearchResult: (req, res) => {
    // Implement search by title
    const title = req.body.title;

    if (!title) {
      return res.render('search', { books: [], error: 'Please enter a title to search.' });
    }

    db.Book.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`
        }
      }
    })
      .then((books) => {
        res.render('search', { books });
      })
      .catch((error) => console.log(error));
  },
  deleteBook: async (req, res) => {
    // Implement delete bookasync (req, res) => {
        try {
            const bookId = req.params.id;
            await db.Book.destroy({ where: { id: bookId } });
            res.redirect('/'); 
        } catch (error) {
            console.error(error);
            res.status(500).send('An error ocurred.');
        }
    res.render('home');
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: async (req, res) => {
    // Implement books by author
    try {
      const authorId = req.params.id;
      const author = await db.Author.findByPk(authorId, {
        include: {
          model: db.Book,
          as: 'books'
        }
      });

      if (!author) {
        return res.status(404).send('Author not found');
      }

      res.render('authorBooks', { author });
    } catch (error) {
      console.error('Error fetching author books:', error);
    }
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: async (req, res) => {
    try {
      await db.User.create({
        Name: req.body.name,
        Email: req.body.email,
        Country: req.body.country,
        Pass: bcryptjs.hashSync(req.body.password, 10),
        CategoryId: req.body.category
      });
      res.redirect('/');
    } catch (error) {
      console.log(error)
    }
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: validationErrors });
    }

    const { email, password, recordarme } = req.body;

    db.User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return res.status(404).send('User does not exist');
        }

        const passHash = bcryptjs.compareSync(password, user.Pass);
        if (!passHash) {
          return res.status(401).send('Incorrect credentials');
        }

        req.session.userLogin = {
          nombre: user.nombre,
          email: user.email,
          categoryId: user.categoryId
        };

        if (recordarme) {
          res.cookie('userLogin', req.session.userLogin, { maxAge: 1000 * 60 * 30 });
        }

        res.redirect('/');
      })
  },
  edit: (req, res) => {
    // Implement edit book
    const { id } = req.params;
    db.Book.findByPk(id)
      .then((book) => {
        if (!book) {
          return res.status(404).send('Book not found');
        }
        res.render('editBook', { book, id });
      })
      .catch((err) => res.status(500).send(err.message));
  },
  processEdit: (req, res) => {
    // Implement edit book
    
    const { id } = req.params;
    const { title, cover, description } = req.body;

   db.Book.update(
      {
        title: title,
        cover: cover,
        description: description,
      },
      {where: {id,},
      })
      .then(() => {
        
        res.redirect("/");
      })
      .catch((err,) => {
        err && res.send(err.message);
    })
  },
  logout: (req, res) => {
    res.clearCookie('userLogin');
    req.session.destroy();
    res.redirect('/');
  },
  clearcookie: (req, res) => {
    
    req.session.destroy(() => {
      res.clearCookie("userLogin");
      res.redirect("/");
    });
}
};

module.exports = mainController;
