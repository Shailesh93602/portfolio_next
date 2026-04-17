"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogFilters } from "@/components/blog/blog-filters";
import { Pagination } from "@/components/ui/pagination";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const ITEMS_PER_PAGE = 12;

import type { BlogPost } from "@/lib/blog-data";

interface Props {
  posts: BlogPost[];
  allTags: string[];
}

export default function BlogsContent({ posts, allTags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get("q") ?? ""
  );
  const [selectedTag, setSelectedTag] = React.useState(
    searchParams.get("tag") ?? ""
  );
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sync search state → URL (debounced 300ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedTag) params.set("tag", selectedTag);
      const qs = params.toString();
      router.replace(qs ? `/blogs?${qs}` : "/blogs", { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, router]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of blog grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-7xl"
        >
          <motion.div variants={pageTransition} className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Latest Blog Posts
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Insights, tutorials, and experiences from my journey in software
              development and technology.
            </p>
          </motion.div>

          <BlogFilters
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            tags={allTags}
            onSearchChange={setSearchQuery}
            onTagChange={setSelectedTag}
            onClearFilters={() => {
              setSearchQuery("");
              setSelectedTag("");
            }}
          />

          {paginatedPosts.length > 0 ? (
            <>
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <motion.div variants={pageTransition} className="py-16 text-center">
              <h2 className="mb-2 text-2xl font-semibold">No posts found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
