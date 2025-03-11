import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { motion, useTransform, useViewportScroll } from "framer-motion";

interface Comment {
  id: number;
  body: string;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

interface CommentList {
  comments: Comment[];
}

const fetchComments = async () => {
  return await axios.get<CommentList>("/comments");
};

const CommentSkeleton = () => {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.12, ease: "easeOut" },
    },
  };

  const skeletonItemVariants = {
    hidden: { opacity: 0, scale: 0.9, x: -30 },
    visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  return (
    <motion.div className="space-y-5" variants={skeletonVariants} initial="hidden" animate="visible">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="flex space-x-5 p-5 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200"
          variants={skeletonItemVariants}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
          <div className="flex-1">
            <div className="w-full h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded mb-2"></div>
            <div className="w-3/4 h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded mb-1"></div>
            <div className="w-1/2 h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const Comments = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Comments"],
    queryFn: fetchComments,
  });
  const navigate = useNavigate();
    const commentListRef = useRef<HTMLDivElement>(null);

  const handleCommentClick = (commentId: number) => {
    navigate(`/comments/${commentId}`);
  };

    const { scrollYProgress } = useViewportScroll();
    const yRange = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const commentVariants = {
    hidden: { opacity: 0, y: 30, rotate: -3 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    tap: { scale: 0.97 },
  };

  const floatingButtonVariants = {
    initial: { scale: 0, opacity: 0, rotate: 45, y: 50 },
    animate: { scale: 1, opacity: 1, rotate: 0, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 180, damping: 15 } },
    exit: { scale: 0, opacity: 0, rotate: 45, y: 50 },
    hover: {
      scale: 1.15,
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.94 },
  };

  const errorVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen p-8"
      style={{ background: "linear-gradient(to bottom, #f0f2f5, #e3f2fd)" }} // A neutral background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
        {/* Subtle Animated Background Elements */}
        <motion.div
            style={{ y: yRange }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-transparent -z-10"
        />

      <motion.h1
        className="text-6xl font-extrabold text-gray-900 text-center mb-12 mt-10 drop-shadow-md" // Added mt-12
        style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 130 }}
      >
        <span className="text-indigo-600 ml-3">Comments</span>
      </motion.h1>

      {isLoading ? (
        <div className="w-full max-w-4xl">
          <CommentSkeleton />
        </div>
      ) : isError ? (
        <motion.div
          className="text-center text-red-500 text-lg py-5 px-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-red-300"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="font-semibold">Whoops! Could not load the comments.</p>
          <p>{error instanceof Error ? error.message : "A strange error popped up. Give it another try."}</p>
        </motion.div>
      ) : (
        <motion.div className="w-full max-w-4xl" initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}
            ref={commentListRef} // Attach the ref here
            style={{overflowY: 'auto', maxHeight: '60vh'}} // Scrollable if overflows, adjust as needed
        >
          <motion.div className="space-y-6">
            {data?.data.comments.map((comment) => (
              <motion.div
                key={comment.id}
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg transition-transform cursor-pointer border border-indigo-50"
                onClick={() => handleCommentClick(comment.id)}
                variants={commentVariants}
              >
                <div className="p-7 flex space-x-6 items-start">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    {comment.user.fullName ? (
                      <motion.div
                        className="text-4xl font-extrabold text-indigo-700 flex items-center justify-center h-full"
                        style={{ background: `linear-gradient(45deg, #E0E7FF, #C4B5FD)` }} // subtle gradient
                      >
                        {comment.user.fullName[0].toUpperCase()}
                      </motion.div>
                    ) : (
                      <div className="h-full w-full bg-indigo-100" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{comment.user.fullName}</h3>
                    <p className="text-gray-700 mt-2 leading-relaxed">{comment.body.slice(0, 120)}...</p>
                    <div className="mt-5 flex justify-between items-center text-gray-600">
                      <span className="flex items-center space-x-3">
                        <button className="hover:text-indigo-500 transition-colors duration-200 focus:outline-none">
                          👍 {comment.likes}
                        </button>
                         <button className="hover:text-blue-500 transition-colors duration-200 focus:outline-none">
                           💬 Comments
                        </button>
                      </span>
                      <span className="text-sm italic text-gray-500">posted on {new Date(comment.id).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      <motion.button
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-8 rounded-full shadow-3xl focus:outline-none transition-transform transform hover:scale-115 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => navigate("./add")}
        variants={floatingButtonVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
      >
        Add Comments
      </motion.button>
    </motion.div>
  );
};

export default Comments;