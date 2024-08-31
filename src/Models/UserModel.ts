import mongoose, { Types } from "mongoose";
export interface IUserSchema extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: string;
  contactDetails?: string;
  education?: string;
  skills?: string;
  workExperience?: string;
  touristBookings?: Types.ObjectId[];
  guideAssignments?: Types.ObjectId[];
  reviews?: Types.ObjectId[];
  stories?: Types.ObjectId[];
  wishlist?: Types.ObjectId[];
}
const userSchema = new mongoose.Schema<IUserSchema>(
  {
    name: {
      type: String,
      unique: true,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      // require: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Tourist", "Guide"],
      default: "Tourist",
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
    touristBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    guideAssignments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
    profilePicture: {
      type: String,
    },
    contactDetails: {
      type: String,
    },
    education: {
      type: String,
    },
    skills: { type: String },
    workExperience: { type: String },
  },
  {
    collection: "Users",
  }
);

const Users =
  mongoose.models.Users || mongoose.model<IUserSchema>("Users", userSchema);
export default Users;
