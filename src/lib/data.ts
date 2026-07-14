import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/types";

export async function getReviews(limit = 20): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eficto_reviews")
    .select("*")
    .order("review_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getReviews", error.message);
    return [];
  }
  return data ?? [];
}

export function averageRating(reviews: Review[]) {
  const rated = reviews.filter((r) => typeof r.rating === "number");
  if (rated.length === 0) return null;
  const sum = rated.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  return sum / rated.length;
}
