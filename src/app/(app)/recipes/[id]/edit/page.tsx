import { RecipeFormScreen } from "@/modules/recipes/RecipeFormScreen";

/** `params` is a Promise in Next 16 — synchronous access was removed. */
export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RecipeFormScreen recipeId={id} />;
}
