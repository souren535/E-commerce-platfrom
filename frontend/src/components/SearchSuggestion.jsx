import React, { useState, useEffect } from "react";
import suggestionLoadingAnimation from "../assets/animations/suggectionLoading.json";
import Lottie from "lottie-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const SearchSuggestion = ({
  open,
  loading,
  onSelect,
  suggestions,
  searchQuery,
  viewAllHandler,
}) => {
  const [showNoSuggestion, setShowNoSuggestion] = useState(false);

  useEffect(() => {
    if (!loading && (!suggestions || suggestions.length === 0)) {
      const timer = setTimeout(() => {
        setShowNoSuggestion(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowNoSuggestion(false);
    }
  }, [loading, suggestions]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="absolute z-[9999] w-full max-h-[500px] border-1 border-zinc-600 bg-zinc-800 rounded-b-lg overflow-hidden flex flex-col"
        >
          <motion.div
            className="overflow-y-auto scrollbar-hide max-h-[500px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  whileHover={{ scaleY: 1.1 }}
                  onMouseDown={() => onSelect(item._id)}
                  className="flex items-center px-3 py-2 bg-zinc-800 text-white cursor-pointer hover:bg-zinc-700  border-b-1 border-zinc-600"
                >
                  <img
                    src={item.image?.[0]?.url || "/images/placeholder.png"}
                    alt={item.name}
                    className="w-[50px] h-[60px] object-cover mr-3 rounded"
                  />
                  <div className="flex flex-col">
                    <span className={`text-lg truncate hover:font-semibold`}>
                      {item.name}
                    </span>
                    <span className="text-md truncate font-light">
                      {item.description}
                    </span>
                    <span className="text-sm font-light">
                      <span>{`Price${" "}`}</span>₹{item.price}
                    </span>
                    <div className="flex flex-wrap font-light">
                      <span className="text-sm font-normal">
                        Stock: {item.stock}
                      </span>
                      <span className="text-sm ml-2 font-light">
                        Rating: {item.ratings}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="px-4 py-2 text-white text-sm flex justify-center items-center min-h-[60px]"
              >
                {loading ? (
                  <div className="w-8 h-8">
                    <Lottie
                      animationData={suggestionLoadingAnimation}
                      loop={true}
                      style={{ width: 80, height: 80 }}
                    />
                  </div>
                ) : (
                  showNoSuggestion && "No Result Found"
                )}
              </motion.div>
            )}
          </motion.div>

          {searchQuery?.trim() && suggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              onMouseDown={(e) => {
                e.preventDefault();
                viewAllHandler();
              }}
              className="text-center text-lg px-4 py-3 bg-zinc-700 text-white font-semibold cursor-pointer hover:bg-zinc-800"
            >
              View All Result <span className="font-bold text-lg">{`>`}</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchSuggestion;
