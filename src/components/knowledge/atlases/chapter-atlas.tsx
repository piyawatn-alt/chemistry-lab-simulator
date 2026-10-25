import { FoundationsAtlas, foundationAtlasIds } from "./foundations-atlas";
import { ReactionsAtlas, reactionAtlasIds } from "./reactions-atlas";
import { OrganicAtlas, organicAtlasIds } from "./organic-atlas";
import { MaterialsAtlas, materialAtlasIds } from "./materials-atlas";

export const atlasArticleIds = [...foundationAtlasIds, ...reactionAtlasIds, ...organicAtlasIds, ...materialAtlasIds];
/** Each chapter owns a subject-specific visual explanation, rather than reusing decorative icons. */
export function ChapterAtlas({ articleId }: { articleId: string }) {
  if (foundationAtlasIds.includes(articleId)) return <FoundationsAtlas articleId={articleId} />;
  if (reactionAtlasIds.includes(articleId)) return <ReactionsAtlas articleId={articleId} />;
  if (organicAtlasIds.includes(articleId)) return <OrganicAtlas articleId={articleId} />;
  if (materialAtlasIds.includes(articleId)) return <MaterialsAtlas articleId={articleId} />;
  return null;
}
