import mongoose from "mongoose";

// Define student schema
const studentSchema = mongoose.Schema(
  {
    // Linked user account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    studentId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    // Basic student info
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    // Contact information
    contact: {
      type: String,
      required: true,
      minlength: [10, "Contact must be 10 digits"],
      maxlength: [10, "Contact must be 10 digits"],
    },
    fatherContact: {
      type: String,
      required: true,
      minlength: [10, "Contact must be 10 digits"],
      maxlength: [10, "Contact must be 10 digits"],
    },
    image: {
      type: String,
      required: true,
    },
    // Hostel room details
    roomNo: {
      type: String,
      required: true,
    },
    blockNo: {
      type: String,
      required: true,
    },
    // Current residency status
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create student model
const Student = mongoose.model("Student", studentSchema);

export default Student;
