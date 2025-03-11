import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion, useTransform, useViewportScroll } from "framer-motion";

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instruction: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  serving: number;
  difficulty: string;
  cuisine: string;
  caloriesPerserving: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

interface RecipesList {
  recipes: Recipe[];
}

const starRating = (rating: number): React.ReactNode => {
  const stars = [];
  for (let i = 1, len = 5; i <= len; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? '#ffc107' : '#ddd', fontSize: '1.2rem' }}>
        {i <= rating ? '★' : '☆'}
      </span>
    );
  }
  return <>{stars}</>;
};

const RecipeCard: React.FC<Recipe> = (recipe: Recipe) => {
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }, // Custom ease
    hover: {
      y: -8,
      scale: 1.05,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.22)", // Stronger shadow
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.96 },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.15, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="group relative bg-white rounded-3xl shadow-md overflow-hidden border-2 border-dashed border-emerald-200" // Unique border
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div className="relative overflow-hidden">
        <motion.img
          alt={recipe.name}
          src={recipe.image}
          className="aspect-square w-full object-cover lg:aspect-auto lg:h-64 transition-opacity duration-300 transform"
          style={{ backgroundColor: "#f0f0f0" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          variants={imageVariants}
          whileHover="hover"
        />
      </motion.div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-1 truncate group-hover:text-emerald-600 transition-colors duration-300">
          {recipe.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1">
              {starRating(recipe.rating)}
            </div>
            <p className="text-gray-500 text-sm mt-1">({recipe.reviewCount} reviews)</p>
          </div>
          <span className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">{recipe.difficulty}</span>
        </div>
      </div>
    </motion.div>
  );
};

const RecipesSkeleton = () => {
  const skeletonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div className="space-y-4 p-5 bg-white rounded-3xl shadow-md border-2 border-dashed border-gray-200" variants={skeletonVariants}>
      <div className="aspect-square w-full rounded-t-3xl bg-gray-300 animate-pulse lg:aspect-auto lg:h-64"></div>
      <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
      <div className="h-3 bg-gray-300 rounded animate-pulse w-1/4"></div>
    </motion.div>
  );
};

const Recipes = () => {
  const getRecipesList = useQuery({ queryKey: ["recipeList"], queryFn: () => axios.get<RecipesList>("/recipes").then(res => res.data) });
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false); // Track button state

  const { scrollYProgress } = useViewportScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [-60, 60]); // Subtle background movement

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7, staggerChildren: 0.15, ease: "easeOut" } },
  };

  const addButtonVariants = {
    initial: { scale: 0, rotate: 180, y: 50 },
    animate: { scale: 1, rotate: 0, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 150, damping: 15 } },
    exit: { scale: 0, rotate: 180, y: 50 },
    hover: { scale: 1.12, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)" }, // More pronounced shadow
    tap: { scale: 0.96 },
    pulse: { scale: [1, 1.1, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } } // Pulse
  };

  const staggerVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }, // Smooth
  };

  const handleAddClick = () => {
    setIsAdding(true); // Start pulse animation
    setTimeout(() => { // Navigate after a delay
      setIsAdding(false);
      navigate("./add");
    }, 700); // Match animation duration
  };


  return (
    <motion.div
      className="container mx-auto px-6 py-12 min-h-screen overflow-hidden relative"
      style={{ background: "linear-gradient(to bottom, #f0fdf4, #edf2f7)" }} // Soft gradient
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.9, ease: "easeOut" } }}
    >
      {/* Subtle Animated Background Elements */}
      <motion.div
        style={{ y: yRange }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50 to-transparent -z-10"
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-48 h-48 bg-emerald-100 rounded-full blur-3xl -z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.5, transition: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "linear" } }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-teal-100 rounded-full blur-3xl -z-10"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 0.8, opacity: 0.5, transition: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "linear" } }}
      />


      <motion.button
        className="fixed bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-7 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 z-10 transition-colors duration-300 font-semibold"
        onClick={handleAddClick} // Call handleAddClick
        variants={addButtonVariants}
        initial="initial"
        animate={isAdding ? "pulse" : "animate"} // Apply pulse animation
        exit="exit"
        whileHover="hover"
        whileTap="tap"
      >
        Add Recipe
      </motion.button>

      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="text-6xl font-extrabold tracking-tight text-gray-900 mb-10 text-center"
          style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)" }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 } }}
        >
           Delicious Recipes
        </motion.h2>
        <motion.div
          className="mt-6 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {getRecipesList.isLoading ? (
            Array.from({ length: 8 }).map((_, index) => <RecipesSkeleton key={index} />)
          ) : getRecipesList.isError ? (
            <div className="text-red-500 text-center col-span-full">Error fetching recipes.</div>
          ) : getRecipesList.data && getRecipesList.data.recipes.length > 0 ? (
            getRecipesList.data.recipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                className="cursor-pointer"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                style={{ display: "block" }}
                variants={staggerVariants} // Apply Entrance Animation
              >
                <RecipeCard {...recipe} />
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 text-center col-span-full">No recipes found.</div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Recipes;