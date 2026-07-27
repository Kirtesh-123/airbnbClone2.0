const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

image:{
  url:String,
  filename:String
},

// geometry: {
//     type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//     },
//     coordinates: {
//         type: [Number],
//         default: [73.8567, 18.5204], // Pune
//     },
// },

//   // Image URL
//   image: {
//   filename: {
//     type: String,
//     default: "listingimage",
//   },
//   url: {
//     type: String,
//     default:
//       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
//   },
// },
    
  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
 owner: {
  type: Schema.Types.ObjectId,
  ref: "User",
},
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);