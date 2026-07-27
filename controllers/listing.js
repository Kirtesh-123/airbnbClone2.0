module;
const Listing = require('../models/listing');

// Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index.ejs', { allListings });
};

// New Route
module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render('listings/new.ejs');
};

// Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate('owner')
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    });

  if (!listing) {
    req.flash('error', 'Listing you requested does not exist!');
    return res.redirect('/listings');
  }

  res.render('listings/show.ejs', { listing });
};

// Create Route
module.exports.createListing = async (req, res, next) => {
  const url = req.file.path;
  const filename = req.file.filename;
  console.log(url, ' ', filename);
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();

  req.flash('success', 'New Listing Created!');
  res.redirect('/listings');
};

// Edit Route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing you request does not exist!');
    return res.redirect('/listings');
  }
  let.OriginalImageUrl = listing.image.url;
 OriginalImageUrl =  OriginalImageUrl.replace('/upload', 'upload/,w_250');
  res.render('listings/edit.ejs', { listing , OriginalImageUrl });
};

// Update Route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file !== 'undefined') {
    const url = req.file.path;
    const filename = req.file.filename;

    listing.image = { url, filename };

    await listing.save();
  }
  req.flash('success', 'Listing Updated!');

  res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash('success', 'Listing Deleted!');

  res.redirect('/listings');
};
