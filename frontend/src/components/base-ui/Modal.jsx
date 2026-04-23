import React, { useEffect } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md', className = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} max-h-[90vh] bg-white/95 dark:bg-black/90 backdrop-blur-2xl rounded-sm shadow-lg flex flex-col ${className}`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-2 border-b border-grey-200/50 dark:border-grey-800/50 shrink-0">
                <h3 className="font-extrabold text-xl text-grey-900 dark:text-grey-100 ml-2">{title}</h3>
                <Button intent="ghost" size="icon" onClick={onClose}>
                  <RiCloseFill size={20} className="text-grey-500" />
                </Button>
              </div>
            )}

            {/* Body */}
            <div className="overflow-y-auto custom-scrollbar flex-1 relative">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
