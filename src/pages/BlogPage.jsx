import { useState } from "react";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";
import { useComments } from "../hooks/useComments";

export default function BlogPage() {
  const { comments, addMutation, updateMutation, deleteMutation, isLoading } =
    useComments();
  const [editing, setEditing] = useState(null);

  const handleAdd = (data) => {
    if (editing) {
      updateMutation.mutate({ ...editing, ...data });
      setEditing(null);
    } else {
      addMutation.mutate(data);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Blog Comments</h1>
      <CommentForm onSubmit={handleAdd} initialData={editing} />
      <div className="space-y-3">
        {comments?.map((comment) => (
          <CommentCard 
            key={comment.id}
            comment={comment}
            onEdit={setEditing}
            onDelete={deleteMutation.mutate}
          />
        ))}
      </div>
    </div>
  );
}
