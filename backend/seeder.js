const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");
const User = require("./models/user");
const products = require("./product");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    await Product.deleteMany();
    await User.deleteMany();

    const createdUser = new User({
      name: "Paul",
      email: "paulmedina645@gmail.com",
      password: "123456",
      role: "admin",
    });

    await createdUser.save();

    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    await Product.insertMany(sampleProducts);
    console.log("Product seeded successfully.");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();