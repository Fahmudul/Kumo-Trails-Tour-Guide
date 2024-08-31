import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Users from "@/Models/UserModel";
import dbConnect from "@/Database/dbConnect";
export const POST = async (request: NextRequest) => {
  try {
    await dbConnect();
    const userInfo = await request.json();
    console.log("from line 7", userInfo);
    const { name, email, password } = userInfo;
    const userExist = await Users.findOne({ email });
    console.log(userExist);
    if (userExist) {
      return NextResponse.json({
        status: 500,
        message: "User already exist",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log(hashedPassword);
    const newUser = new Users({ name, email, password: hashedPassword });
    await newUser.save();
    return NextResponse.json({
      message: "User created successfully",
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
};
