import { auth } from "@/app/(auth)/lib/auth";
import { parseSearchParams } from "@/app/dashboard/_lib/search-params";
import { getBookmarkCounts, getBookmarkTags } from "@/app/dashboard/dal/user.data.dal";

export async function GET(req: Request) {
  const searchParams = req.url.split("?")[1] || "";
  const transformedSP = Object.fromEntries(new URLSearchParams(searchParams));
  const parsedSP = parseSearchParams(transformedSP);

  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id || null;

  if (!userId) {
    return new Response(JSON.stringify({ active: 0, archived: 0, tags: [] }), { status: 200 });
  }

  const [tags, counts] = await Promise.all([getBookmarkTags(userId), getBookmarkCounts(parsedSP)]);

  return new Response(JSON.stringify({ ...counts, tags }), { status: 200 });
}
