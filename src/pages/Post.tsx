import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  thumbnail: string;
  reactions: Reaction;
  views: number;
  userId: number;
}

interface Reaction {
  likes: number;
  dislikes: number;
}

interface PostList {
  posts: Post[];
}

// Fungsi untuk mengambil data pos dari API
const fetchPostList = async () => {
  return await axios.get<PostList>("/post");
};

// Komponen Skeleton Loader (Menampilkan loading state)
const PostSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-2xl"></div> {/* Increased rounded-ness */}
      <div className="w-2/3 h-6 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
    </div>
  );
};

// Komponen utama Post
const Post = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Post"],
    queryFn: fetchPostList,
  });
  const navigate = useNavigate();

  // Fungsi untuk menangani klik pos dan mengarahkan ke halaman detail
  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"> {/* Larger shadow */}
        {/* Circular background element (top-right) */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full mix-blend-soft-light filter blur-xl opacity-50"></div>

        {/* Circular background element (bottom-left) */}
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full mix-blend-soft-light filter blur-xl opacity-50"></div>

        {/* "Add Post" Button (More prominent) */}
        <button
          className="absolute top-4 right-4 bg-indigo-500 text-white rounded-full p-3 shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-10"
          onClick={() => navigate("./add")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>

        {/* Main Content Area */}
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Community Posts</h1>

          {isLoading && (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {isError && (
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">Error fetching posts:</h2>
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          )}

          {data?.data.posts.map((post) => (
            <div
              key={post.id}
              className="flex space-x-6 cursor-pointer hover:bg-blue-50 p-6 rounded-xl shadow-md transition-colors duration-200 border border-gray-100"
              onClick={() => handlePostClick(post.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mt-1">{post.body.slice(0, 120)}...</p>
                <div className="flex flex-wrap mt-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 text-gray-500">
                  <div className="flex space-x-3">
                    <span>{post.reactions.likes} Likes</span>
                    <span>{post.reactions.dislikes} Dislikes</span>
                  </div>
                  <div>{post.views} Views</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;