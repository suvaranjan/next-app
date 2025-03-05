import { format, parseISO } from "date-fns";

import { MDXContent } from "@/components/mdx-content";
import { CalendarIcon } from "lucide-react";
import { allPosts } from ".contentlayer/generated";
import { PostSearch } from "@/components/post-search";

// Update the type definition to match Next.js 15 requirements
type Props = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

const PostLayout = ({ params }: Props) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);

  return (
    <main className="container max-w-4xl py-10 px-4 mx-auto">
      {/* Add search bar at the top */}
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

        <div className="prose prose-xs dark:prose-invert max-w-none font-sans">
          <MDXContent code={post.body.code} />
        </div>
      </article>
    </main>
  );
};

export default PostLayout;

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};
