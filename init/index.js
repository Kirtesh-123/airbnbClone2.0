const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnbClone";

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // Purani listings delete
  await Listing.deleteMany({});

  // Har listing me owner add karo
  const data = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId('6a64bda17782bfa8d6dbfe9e'),
  }));

  console.log("Mapped Data:", data[0]); // 👈 Yaha owner ObjectId dikhna chahiye

  // Insert
  await Listing.insertMany(data);

  // DB se check karo
  const listing = await Listing.findOne();
  console.log("Saved Listing:", listing);

  console.log("Data was initialized");
};

main()
  .then(async () => {
    console.log("Connected to DB");
    await initDB();
    console.log("DB seeded successfully");
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));