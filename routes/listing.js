const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');
// const WrapAsync = require("../utils/wrapAsync");
const WrapAsync = require('../utils/WrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listing');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

// Index Route & Create Route
router
  .route('/')
  .get(WrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    WrapAsync(listingController.createListing),
  );

// New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show Route, Update Route & Delete Route
router
  .route('/:id')
  .get(isLoggedIn, WrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    WrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, WrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.renderEditForm),
);

module.exports = router;
