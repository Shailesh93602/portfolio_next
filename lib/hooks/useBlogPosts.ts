"use client";

import { useState, useEffect } from "react";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
  link?: string;
    tags: string[];
    author: {
      name: string;
      avatar: string;
    };
}

export function useBlogPosts(initialTag = "", initialSearch = "") {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedTag) params.append("tag", selectedTag);
        if (searchQuery) params.append("search", searchQuery);

        const response = await fetch(`/api/blogs?${params.toString()}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTag, searchQuery]);

  return {
    posts,
    isLoading,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
  };
}