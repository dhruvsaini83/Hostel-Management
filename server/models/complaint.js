import mongoose from "mongoose";

const complaintSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Electrical", "Plumbing", "Furniture", "Cleaning", "Other"],
    },
    roomNo: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "In Progress", "Resolved"],
    },
    adminComment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
