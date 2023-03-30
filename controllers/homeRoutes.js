const router = require('express').Router();
const { SavedUserRecipes, User } = require('../models');
const withAuth = require('../utils/auth');

//LAST TO DO
router.get('/', async (req, res) => {
  try {  res.render('homepage', { 
    logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    console.log('HERE I AM')
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: SavedUserRecipes }], //REMEMBER TO UPDATE MODEL**********
    });

    const user = userData.get({ plain: true });

    res.render('homepage', 
    {
      ...user,
      logged_in: true
    });
    
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route


  res.render('signup');
});

module.exports = router;