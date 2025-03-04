import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import path from "path";
import { writeFileSync } from "fs";
import { Document } from "node_modules/@contentlayer2/core/dist/data-types";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    keyword: { type: "string", required: true },
    date: { type: "date", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}));

// Function to create the search index file
function createSearchIndex(allPosts: Document[]) {
  const searchData = allPosts.map((post) => ({
    title: post.title,
    keyword: post.keyword,
    slug: post.slug,
  }));
  // Write the search index data to a search.json file
  const searchIndexPath = path.join(
    process.cwd(),
    "src/data",
    "post-search.json"
  );
  writeFileSync(searchIndexPath, JSON.stringify(searchData, null, 2));
}

export default makeSource({
  contentDirPath: "src/data/summary",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: { className: ["anchor"] },
        },
      ],
    ],
  },
  onSuccess: async (importData) => {
    const data = await importData();
    createSearchIndex(data.allDocuments); // Generate search index after content is processed
  },
});
