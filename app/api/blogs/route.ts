import { NextResponse } from "next/server";
import { blogPosts, BlogPost } from "@/lib/blog-posts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
  
    let filteredPosts: BlogPost[] = blogPosts;
  
    if (tag) {
      filteredPosts = filteredPosts.filter((post: BlogPost) => post.tags.includes(tag));
    }
  
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post: BlogPost) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower)
      );
    }
  
    // Only return public fields for API
    const publicPosts = filteredPosts.map(({ slug, title, description, image, date, readTime, tags }: BlogPost) => ({
      slug, title, description, image, date, readTime, tags
    }));
    return NextResponse.json(publicPosts);
}