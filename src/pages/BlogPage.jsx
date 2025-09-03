import { useState, useRef } from "react";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import { useComments } from "../hooks/useComments";
import Loader from "../components/Loader";


export default function BlogPage() {
  const { comments, addMutation, updateMutation, deleteMutation, isLoading } = useComments();
  const [editing, setEditing] = useState(null);
  const [lastEditedId, setLastEditedId] = useState(null);

  const formRef = useRef(null);

  const handleAdd = (data) => {
    if (editing) {
      setLastEditedId(editing.id);

      updateMutation.mutate({ ...editing, ...data }, {
        onSuccess: () => setEditing(null),
      });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleEdit = (comment) => {
    setEditing(comment);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <Loader/>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 ">
      <h1 className="text-4xl font-bold mb-4 text-center" ref={formRef}>
        Blog Comments
      </h1>

      <CommentForm onSubmit={handleAdd} initialData={editing} />

      <CommentList
        comments={comments}
        onEdit={handleEdit}
        onDelete={deleteMutation.mutate}
        lastEditedId={lastEditedId}
      />
    </div>
  );
}
