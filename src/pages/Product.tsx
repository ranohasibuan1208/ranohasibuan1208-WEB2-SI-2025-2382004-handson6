import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string
}

interface ProductData {
  products: Product[]
}

const fetchProductList = async () => {
  return await axios.get<ProductData>("/product")
}

const ProductSkeleton = () => {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div className="group relative" variants={skeletonVariants} initial="hidden" animate="visible">
      {/* Image Placeholder */}
      <div className="aspect-square w-full rounded-3xl bg-gray-100 animate-pulse lg:aspect-auto lg:h-72"></div>

      <div className="mt-4 flex justify-between">
        {/* Title Placeholder */}
        <div>
          <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
          {/* Description Placeholder */}
          <div className="mt-1 h-2 bg-gray-100 rounded animate-pulse w-2/3"></div>
        </div>
        {/* Price Placeholder */}
        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
      </div>
    </motion.div>
  );
};

const Product = () => {
  const getProductList = useQuery({ queryKey: ["productList"], queryFn: fetchProductList })
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, staggerChildren: 0.1 },
    },
  };

  const productVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -5,
      scale: 1.05,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const addButtonVariants = {
    initial: { scale: 0, rotate: 180 },
    animate: { scale: 1, rotate: 0, transition: { duration: 0.4, type: "spring", stiffness: 150 } },
    hover: { scale: 1.1, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)" },
    tap: { scale: 0.9 }
  };

  return (
    <motion.div
      className="container mx-auto px-5 py-12 min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      <motion.button
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 z-10 transition-transform"
        onClick={() => navigate("./add")}
        variants={addButtonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        Add Product
      </motion.button>
      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        <div className="mx-auto max-w-2xl px-6 py-14 sm:px-8 sm:py-20 lg:max-w-7xl lg:px-10">
          <motion.h2
            className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }}
          >
             Products
          </motion.h2>
          <motion.div
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {getProductList.isFetching ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              getProductList.data?.data.products.map((product) => (
                <motion.div
                  key={product.id}
                  className="group relative cursor-pointer rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                  variants={productVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => navigate(`/product/${product.id}`)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <img
                    alt={product.title}
                    src={product.thumbnail}
                    className="aspect-square w-full object-cover transition-opacity duration-300 group-hover:opacity-90 lg:aspect-auto lg:h-72"
                    style={{ backgroundColor: "#f0f0f0" }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-lg font-medium text-gray-900">{product.price}$</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Product