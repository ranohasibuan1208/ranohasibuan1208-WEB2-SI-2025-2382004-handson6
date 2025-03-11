import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useTransform, useViewportScroll } from "framer-motion";

interface Todo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
    image?: string;
}

interface TodoList {
    todos: Todo[];
}

const fetchTodos = async () => {
    return await axios.get<TodoList>("/todos");
};

const TodoSkeleton = () => {
    const skeletonVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, staggerChildren: 0.08, ease: "easeOut" },
        },
    };

    const skeletonItemVariants = {
        hidden: { opacity: 0, scale: 0.9, x: -20 },
        visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.4, ease: "easeInOut" } },
    };

    return (
        <motion.div className="space-y-4" variants={skeletonVariants} initial="hidden" animate="visible">
            {[...Array(3)].map((_, index) => (
                <motion.div
                    key={index}
                    className="flex items-center space-x-5 p-5 bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100"
                    variants={skeletonItemVariants}
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    <div className="flex-1">
                        <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded mb-1"></div>
                        <div className="w-1/2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

const Todos = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["Todos"],
        queryFn: fetchTodos,
    });
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const handleTodoClick = (todoId: number) => {
        navigate(`/todos/${todoId}/edit`);
    };

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const { scrollYProgress } = useViewportScroll();
    const yRange = useTransform(scrollYProgress, [0, 1], [-70, 70]);

    const todoVariants = {
        hidden: { opacity: 0, y: 30, rotate: -2 },
        visible: {
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
        hover: {
            y: -7,
            scale: 1.04,
            boxShadow: "0px 7px 18px rgba(0, 0, 0, 0.2)", // Refined Shadow
            transition: { duration: 0.2, ease: "easeOut" },
        },
        tap: { scale: 0.97 }
    };

    const floatingButtonVariants = {
        initial: { scale: 0, opacity: 0, rotate: 180, y: 50 },
        animate: { scale: 1, opacity: 1, rotate: 0, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 170, damping: 14 } },
        exit: { scale: 0, opacity: 0, rotate: 180, y: 50 },
        hover: {
            scale: 1.1,
            boxShadow: "0px 5px 14px rgba(0, 0, 0, 0.25)", // Deepened
            transition: { duration: 0.15 },
        },
        tap: { scale: 0.93 },
    };

    const errorVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
    };

    const imageVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    };

    const getBackgroundColor = (completed: boolean): string => {
      if (completed) return `linear-gradient(45deg, #86efac, #a7f3d0)`; // Soft green gradient
      return `linear-gradient(45deg, #fcd34d, #fef08a)`; // Warmer yellow-orange gradient
    };

    return (
        <motion.div
            className="relative min-h-screen overflow-hidden"
            style={{ background: `radial-gradient(650px at ${mousePosition.x}px ${mousePosition.y}px, rgba(187, 247, 208, 0.1), rgba(255, 255, 255, 0.04))` }} // Very Subtle Gradient
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Animated Background Circle */}
            <motion.div
                style={{ y: yRange }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-transparent -z-10"
            />

            <div className="container mx-auto p-8">
                <motion.h1
                    className="text-5xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-md text-emerald-800" // Richer Heading Color
                    style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)" }}
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 130 }}
                >
                   Add Todos
                </motion.h1>

                {isLoading ? (
                    <div className="max-w-2xl mx-auto">
                        <TodoSkeleton />
                    </div>
                ) : isError ? (
                    <motion.div
                        className="text-center text-red-500 text-lg py-6 px-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-red-200"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h2 className="text-xl font-semibold text-red-600 mb-3">Oops! Todos could not load.</h2>
                        <p>{error instanceof Error ? error.message : "A mysterious error has occurred."}</p>
                    </motion.div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-6">
                        {data?.data.todos.map((todo) => (
                            <AnimatePresence key={todo.id}>
                                <motion.div
                                    className="flex items-center space-x-5 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl cursor-pointer border border-emerald-50 hover:border-emerald-300"
                                    onClick={() => handleTodoClick(todo.id)}
                                    variants={todoVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    layout
                                >
                                    {todo.image && (
                                        <motion.img
                                            src={todo.image}
                                            alt={`Todo ${todo.id}`}
                                            className="w-16 h-16 rounded-2xl object-cover shadow-md"
                                            variants={imageVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            layoutId={`todo-image-${todo.id}`}
                                        />
                                    )}

                                    {/* Animate status */}
                                    <motion.div
                                        className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold"
                                        style={{ background: getBackgroundColor(todo.completed) }}
                                     initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
                                       exit={{ scale: 0, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
                                    >
                                        {todo.completed ? "✓" : "!"}
                                    </motion.div>

                                    <div className="flex-1">
                                        <motion.h2 className="text-2xl font-semibold text-gray-800 line-clamp-1 transition-colors duration-300 hover:text-emerald-600">{todo.todo}</motion.h2>
                                        <p className="text-gray-600 text-sm italic mt-1">Status: {todo.completed ? "Done!" : "Get it done!"}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ))}
                    </div>
                )}
            </div>

            <motion.button
                className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-7 rounded-full shadow-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 font-semibold flex items-center justify-center space-x-2"
                onClick={() => navigate("./add")}
                variants={floatingButtonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                whileTap="tap"
            >
              Add Todos
            </motion.button>
        </motion.div>
    );
};

export default Todos;