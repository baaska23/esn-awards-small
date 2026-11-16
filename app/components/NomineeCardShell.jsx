import { motion } from "framer-motion";

// Shared frame for the nominee cards: one glass layer, entrance animation,
// selected state, and click / Enter / Space to vote.
export default function NomineeCardShell({ index = 0, isSelected = false, onClick, className = "", children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ delay: Math.min(index, 12) * 0.05, duration: 0.35 }}
            className={`nominee-card glass ${isSelected ? "glass-selected" : ""} ${className}`}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={onClick}
            onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {children}
        </motion.div>
    );
}
