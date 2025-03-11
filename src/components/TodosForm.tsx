import { useState } from "react";
import { motion } from "framer-motion";

export interface TodoData {
  title: string;
  completed: boolean;
  userId: number;
}

interface TodosFormProps {
  isEdit: boolean;
  mutateFn: (data: TodoData) => void;
}

const TodosForm: React.FC<TodosFormProps> = ({ isEdit, mutateFn }) => {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === "") {
      setErrorMessage("Todo cannot be empty!");
      return;
    }

    mutateFn({ title, completed: false, userId: 1 }); // Adjust userId with authentication
    setTitle("");
    setErrorMessage("");
  };

  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const inputVariants = {
    focus: {
      boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)", // Subtle shadow on focus
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.03, backgroundColor: "#374151", transition: { duration: 0.2 } }, // Darker gray
    tap: { scale: 0.98 },
  };

  const errorMessageVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-8 rounded-xl shadow-md bg-white border border-gray-100" // Simpler styling
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        {isEdit ? "Edit Todo" : ""}
      </h2>

      {errorMessage && (
        <motion.p
          className="text-red-500 text-center mb-3 text-sm"
          variants={errorMessageVariants}
          initial="initial"
          animate="animate"
        >
          {errorMessage}
        </motion.p>
      )}

      <motion.form onSubmit={handleSubmit} className="space-y-3">
        <motion.input
          type="text"
          className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200 transition-shadow duration-300" // Softer focus ring
          placeholder="What do you want to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variants={inputVariants}
          whileFocus="focus"
        />

        <motion.button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-md transition-colors duration-300 font-medium" // Darker gray button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isEdit ? "Save Changes" : "Add Todo"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default TodosForm;