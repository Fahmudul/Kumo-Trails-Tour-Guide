import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Mongodb connected");
    });
    connection.on("error", (err) => {
      console.error(err);
    });
  } catch (error: any) {
    console.error(error);
  }
};
export default dbConnect;
