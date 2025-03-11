import { useMutation } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface RecipeData {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string;
}

const addRecipe = async (data: RecipeData) => {
    return await axios.post("/recipes/add", data);
};

const AddRecipes = () => {
    const [formData, setFormData] = useState<RecipeData>({
        title: "",
        description: "",
        ingredients: [],
        instructions: "",
    });

    const [ingredientsText, setIngredientsText] = useState("");

    const { mutate, isSuccess, isPending } = useMutation({
        mutationFn: addRecipe,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            navigate("/recipes", { replace: true });
        }
    }, [isSuccess, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ingredientsArray = ingredientsText
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        mutate({
            ...formData,
            ingredients: ingredientsArray
        });
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96], staggerChildren: 0.1 },
        },
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeInOut" },
        },
    };

    const labelVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
    };

    const inputVariants = {
        focus: {
            boxShadow: "0 0 0 3px rgba(129, 140, 248, 0.5)", // Subtle Indigo Ring
            transition: { duration: 0.2 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05, backgroundColor: "#6366f1", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
        tap: { scale: 0.98 }
    };

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50" // Updated Gradient
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.form
                onSubmit={handleSubmit}
                className="relative bg-white p-10 rounded-3xl shadow-3xl w-full max-w-2xl border border-indigo-100" // Increased Shadow
                variants={formVariants}
            >
                {isPending && (
                    <motion.div className="absolute inset-0 bg-white/70 backdrop-blur-md z-10 flex items-center justify-center rounded-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}>
                        <div className="flex items-center bg-white/95 px-7 py-4 rounded-full shadow-lg border border-indigo-200">
                            <span className="text-lg mr-4 text-gray-800 font-semibold">Adding Recipe...</span>
                            <motion.div
                                className="h-7 w-7 border-5 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </motion.div>
                )}

                <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                    Add New Recipe
                </h2>

                <div className="mb-6">
                    <motion.label
                        className="block text-gray-700 font-medium mb-3"
                        htmlFor="title"
                        variants={labelVariants}
                        initial="hidden"
                        animate="visible"
                    >Recipe Title</motion.label>
                    <motion.input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-2xl text-gray-800 shadow-sm focus:outline-none focus:ring" // Rounded Input
                        variants={inputVariants}
                        whileFocus="focus"
                        required
                    />
                </div>

                <div className="mb-6">
                    <motion.label
                        className="block text-gray-700 font-medium mb-3"
                        htmlFor="description"
                        variants={labelVariants}
                        initial="hidden"
                        animate="visible"
                    >Description</motion.label>
                    <motion.textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-2xl text-gray-800 shadow-sm focus:outline-none focus:ring" // Rounded Input
                        rows={4}
                        variants={inputVariants}
                        whileFocus="focus"
                        required
                    />
                </div>

                <div className="mb-6">
                    <motion.label
                        className="block text-gray-700 font-medium mb-3"
                        htmlFor="ingredients"
                        variants={labelVariants}
                        initial="hidden"
                        animate="visible"
                    >Ingredients (one per line)</motion.label>
                    <motion.textarea
                        id="ingredients"
                        value={ingredientsText}
                        onChange={(e) => setIngredientsText(e.target.value)}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-2xl text-gray-800 shadow-sm focus:outline-none focus:ring" // Rounded Input
                        rows={7}
                        variants={inputVariants}
                        whileFocus="focus"
                        required
                    />
                </div>

                <div className="mb-6">
                    <motion.label
                        className="block text-gray-700 font-medium mb-3"
                        htmlFor="instructions"
                        variants={labelVariants}
                        initial="hidden"
                        animate="visible"
                    >Instructions</motion.label>
                    <motion.textarea
                        id="instructions"
                        value={formData.instructions}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        className="mt-1 block w-full p-4 border border-gray-300 rounded-2xl text-gray-800 shadow-sm focus:outline-none focus:ring" // Rounded Input
                        rows={7}
                        variants={inputVariants}
                        whileFocus="focus"
                        required
                    />
                </div>

                <motion.button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-2xl transition-colors duration-300 font-semibold shadow-md"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    Share Your Recipe
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default AddRecipes;