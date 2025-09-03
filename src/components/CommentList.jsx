import { useRef, useEffect } from "react";
import CommentCard from "./CommentCard";

export default function CommentList({ comments, onEdit, onDelete, lastEditedId }) {
  const cardRefs = useRef({});

  useEffect(() => {
    if (lastEditedId && cardRefs.current[lastEditedId]) {
      cardRefs.current[lastEditedId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // highlight effect
      const el = cardRefs.current[lastEditedId];
      el.classList.add("bg-yellow-100");
      setTimeout(() => el.classList.remove("bg-yellow-100"), 1500);
    }
  }, [lastEditedId]);

  return (
    <div className="space-y-3">
      {comments?.map((comment) => (
        <div
          key={comment.id}
          ref={(el) => (cardRefs.current[comment.id] = el)}
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
