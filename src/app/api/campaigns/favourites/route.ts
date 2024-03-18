import { dbConnect } from "@/utils/mongodb";
import { User } from "@/models";
import { Schema } from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const {searchParams} = new URL(req.url!);
    const id = searchParams.get('id');

    const user = await User.findOne({ _id: id });

    const result = user.favourites.map((favourite: Schema.Types.ObjectId) => {
      return favourite.toString();
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    return new Response(error.toString(), { status: 500 });
  }
}