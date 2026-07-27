const express = require('express');
const router = express.Router({ mergeParams: true });

const WrapAsync = require('../utils/WrapAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const reviewController = require('../controllers/review');

// Create Review
router.post(
  '/',
  isLoggedIn,
  validateReview,
  WrapAsync(reviewController.createReview),
);

// Delete Review
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(reviewController.destroyReview),
);

module.exports = router;
