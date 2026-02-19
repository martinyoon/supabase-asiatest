import { supabase } from "../supabaseClient.js";

const TABLE_NAME = "posts";

export async function fetchPosts() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id, author, title, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createPost(post) {
  const { error } = await supabase.from(TABLE_NAME).insert(post);

  if (error) {
    throw new Error(error.message);
  }
}

export async function removePostById(id) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
