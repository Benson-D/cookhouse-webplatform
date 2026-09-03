import { RecipeDetailScreen } from "@/modules/recipes/RecipeDetailScreen";

/** `params` is a Promise in Next 16 — synchronous access was removed. */
export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecipeDetailScreen recipeId={id} />;
}
