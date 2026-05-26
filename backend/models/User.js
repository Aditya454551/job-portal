import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },

  name: { 
    type: String, 
    default: "User" 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  image: { 
    type: String, 
    required: true 
  },
  savedJobs: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
],

  resume: { 
    type: String 
  }
});

const User = mongoose.model("User", userSchema);

export default User;