"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, Tag, Twitter, Github, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogLayoutProps {
  children: React.ReactNode;
  post: {
    title: string;
    description: string;
    date: string;
    readTime: string;
    tags: string[];
    author: {
      name: string;
      avatar: string;
      bio: string;
      role: string;
      social: {
        twitter?: string;
        github?: string;
        linkedin?: string;
      };
    };
    relatedPosts?: {
      slug: string;
      title: string;
    }[];
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
  }
};

export function BlogLayout({ children, post }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <motion.div 
        className="container mx-auto px-4 py-12 md:py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid lg:grid-cols-[1fr,320px] gap-12 max-w-7xl mx-auto">
          <motion.article variants={fadeInUp} className="prose prose-invert max-w-none">
            <motion.header className="mb-12 space-y-6" variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 not-prose">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium mb-1">Written by {post.author.name}</div>
                    <div className="text-sm text-muted-foreground">{post.author.role}</div>
                  </div>
                </div>
              </div>
            </motion.header>

            <motion.div variants={fadeInUp} className="blog-content relative">
              {children}
            </motion.div>

            <motion.footer variants={fadeInUp} className="mt-16 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Written by {post.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {post.author.role} • Find more articles by Shailesh Chaudhari
                  </div>
                </div>
              </div>
            </motion.footer>
          </motion.article>

          <motion.aside variants={slideInRight} className="space-y-8">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  About the Author
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.author.name}</div>
                      <div className="text-sm text-muted-foreground">{post.author.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.author.bio}</p>
                  <div className="flex gap-4">
                    {post.author.social.twitter && (
                      <a 
                        href={post.author.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {post.author.social.github && (
                      <a 
                        href={post.author.social.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {post.author.social.linkedin && (
                      <a 
                        href={post.author.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Related Posts
                  </div>
                  <div className="space-y-3">
                    {post.relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="block text-sm hover:text-primary transition-all duration-200 p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20"
                      >
                        <div className="font-medium line-clamp-2">{relatedPost.title}</div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </div>
  );
}