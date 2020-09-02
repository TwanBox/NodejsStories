const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Story = require('../models/Story');

// Add story form
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// Creating a new story
router.post('/', ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await Story.create(req.body);
		res.redirect('/dashboard');
	} catch (err) {
		console.error(err);
		res.render('error/404')
	}
});

// Display all stories
router.get('/', ensureAuth, async (req, res) => {
  try {
		const stories = await Story.find({ status: 'public' })
		.populate('user')
		.sort({ createdAt: 'desc' })
		.lean()

		res.render('stories/index', {
			stories
		});
	} catch (err) {
		console.log(err);
		res.render('error/404')
	}
});

module.exports = router;