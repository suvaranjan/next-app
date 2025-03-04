"use client";

import type React from "react";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";

const components = {
  Image,
  // Headings
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={`mt-8 mb-4 text-3xl font-bold ${className}`} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={`mt-8 mb-4 text-2xl font-bold ${className}`} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`mt-6 mb-3 text-xl font-bold ${className}`} {...props} />
  ),
  // Paragraphs and lists
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`my-4 ${className}`} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={`my-4 list-disc pl-6 ${className}`} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={`my-4 list-decimal pl-6 ${className}`} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={`mt-1 ${className}`} {...props} />
  ),
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return (
    <div className="prose prose-lg prose-blue dark:prose-invert">
      <Component components={components} />
    </div>
  );
}
