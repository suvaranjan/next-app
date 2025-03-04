"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import postData from "@/data/post-search.json";

interface Post {
  title: string;
  keyword: string;
  slug: string;
}

export function PostSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts([]);
    } else {
      const results = postData.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(results);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePostClick = (slug: string) => {
    setSearchQuery("");
    setIsOpen(false);
    router.push(slug);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-8" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search summary..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && filteredPosts.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1">
            {filteredPosts.map((post) => (
              <li
                key={post.slug}
                className="px-4 py-2 hover:bg-muted cursor-pointer"
                onClick={() => handlePostClick(post.slug)}
              >
                {post.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
