import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        className="max-w-md w-full text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-9xl font-bold text-primary"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            Oops! The page you are looking for does not exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              to="/"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 bg-background border border-border rounded-md hover:bg-muted transition-colors"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
