import mongoose from "mongoose";

const grievanceSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: {
      type: String,
      required: true,
    },
    correctStatus: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "Leave"],
    },
    reason: {
      type: String,
      required: true,
    },
    proof: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminComment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;
