import { dbConnect } from "@/utils/mongodb";
import { User } from "@/models";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { id, userId } = await req.json();

    const user = await User.findByIdAndUpdate(userId, {
      $pull: { favourites: id },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    return new Response(error.toString(), { status: 500 });
  }
}