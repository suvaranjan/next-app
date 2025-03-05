import { format, parseISO } from "date-fns";
import { MDXContent } from "@/components/mdx-content";
import { CalendarIcon } from "lucide-react";
import { allPosts } from ".contentlayer/generated";
import { PostSearch } from "@/components/post-search";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const resolvedParams = await params; // Resolve the Promise

  const post = allPosts.find(
    (post) => post._raw.flattenedPath === resolvedParams.slug
  );
  if (!post) throw new Error(`Post not found for slug: ${resolvedParams.slug}`);

  return { title: post.title };
};

export default async function PostLayout({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params; // Resolve the Promise

  if (!resolvedParams || !resolvedParams.slug) {
    throw new Error("Invalid params: Missing slug.");
  }

  const post = allPosts.find(
    (post) => post._raw.flattenedPath === resolvedParams.slug
  );
  if (!post) throw new Error(`Post not found for slug: ${resolvedParams.slug}`);

  return (
    <main
      className="py-10 px-6 mx-auto 
      bg-[#FAF3E0] dark:bg-[#1E1B16] shadow-xl 
      text-gray-900 dark:text-gray-100 leading-relaxed"
    >
      <div className="container max-w-4xl mx-auto">
        <PostSearch />

        <article className="prose prose-slate dark:prose-invert lg:prose-lg mx-auto">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={post.date} className="text-sm">
                Last updated on {format(parseISO(post.date), "MMMM d, yyyy")}
              </time>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              {post.title}
            </h1>
          </div>

          <div
            className="prose prose-xs dark:prose-invert max-w-none
            bg-[#FFF8E7] dark:bg-[#2A241E] px-6 py-4 rounded-lg shadow-lg border 
            border-[#E0D6C8] dark:border-[#3E362E] text-gray-900 dark:text-gray-200 
            leading-relaxed transition-all duration-300"
          >
            <MDXContent code={post.body.code} />
          </div>
        </article>
      </div>
    </main>
  );
}
