import { supabase } from "@/lib/supabaseClient";
import { LoaderFunctionArgs } from "react-router-dom";

export async function blogIndexLoader() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, published_at")
    .order("published_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [] };
  }
  return { posts: data || [] };
}

export async function blogPostLoader({ params }: LoaderFunctionArgs) {
  if (!params.slug) return { post: null };
  
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();
    
  if (error) {
    console.error("Error fetching post:", error);
    return { post: null };
  }
  return { post: data };
}
