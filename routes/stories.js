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

// Display a single story
router.get('/:id', ensureAuth, async (req, res) => {
  try {
		let story = await Story.findById(req.params.id)
		.populate('user')
		.lean();
	if (!story) {
		return res.render('/error/404');
	}
	res.render('stories/readmore', {
		story
	});
	} catch (err) {
		console.error(err);
		res.render('error/404');
	}
});


// Display edit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
	try {
		const story = await Story.findOne({
		_id: req.params.id
	}).lean();

	if (!story) {
		return res.render('error/404');
	}

	if (story.user != req.user.id) {
		res.redirect('/stories');
	} else {
		res.render('stories/edit', {
			story
		});
	}
	} catch (err) {
		console.error('err');
	  return res.render('error/404')
	}
});


// Update a story
router.put('/:id', ensureAuth, async (req, res) => {
	try {
		let story = await Story.findById(req.params.id).lean();
	if (!story) {
		return res.render('error/404');
	}

	if (story.user != req.user.id) {
		res.redirect('/stories');
	} else {
		story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
			runValidators: true
		});
		res.redirect('/dashboard');
	}
	} catch (err) {
		console.error('err');
	  return res.render('error/404')
	}
});

// Delete a story
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
	  await Story.deleteOne({ _id: req.params.id });
	  res.redirect('/');
  } catch (err) {
	  console.error('err');
	  return res.render('error/404')
  }
});


module.exports = router;