const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story');

// Login page (if user is logged out)
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
});

// Dashboard (if user is logged in)
router.get('/dashboard', ensureAuth , async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      lastName: req.user.lastName,
      stories
    });
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

module.exports = router;