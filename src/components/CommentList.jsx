import { useRef, useEffect } from "react";
import CommentCard from "./CommentCard";

export default function CommentList({ comments, onEdit, onDelete, highlightedId }) {
  const cardRefs = useRef({});

  useEffect(() => {
    if (highlightedId && cardRefs.current[highlightedId]) {
      const el = cardRefs.current[highlightedId];
      
      // Scroll to element
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add highlight effect
      el.classList.add("bg-yellow-100", "transition-colors", "duration-500");
      
      // Remove highlight after delay
      setTimeout(() => {
        if (el && el.classList.contains("bg-yellow-100")) {
          el.classList.remove("bg-yellow-100");
        }
      }, 2000);
    }
  }, [highlightedId]);

  // Filter out any temporary or duplicate comments
  const uniqueComments = comments.filter((comment, index, self) =>
    index === self.findIndex((c) => c.id === comment.id)
  );

  return (
    <div className="space-y-3">
      {uniqueComments.map((comment) => (
        <div
          key={comment.id}
          ref={(el) => (cardRefs.current[comment.id] = el)}
          className="transition-all duration-300"
        >
          <CommentCard
            comment={comment}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}