import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./server/models/user.js";

dotenv.config();

const makeAllUsersAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    
    const result = await User.updateMany({}, { $set: { isAdmin: true } });
    console.log(`Updated ${result.nModified} users to Admin.`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

makeAllUsersAdmin();
