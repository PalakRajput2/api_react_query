import { useState, useRef } from "react";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList"; 
import ConfirmDialog from "../components/ConfirmDialog";
import InlineAlert from "../components/InlineAlert";
import { useComments } from "../hooks/useComments";
import Loader from "../components/Loader";

export default function BlogPage() {
  const { comments, addMutation, updateMutation, deleteMutation, isLoading } =
    useComments();

  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [alert, setAlert] = useState({ type: "success", message: "" });
  const [highlightedId, setHighlightedId] = useState(null);

  const formRef = useRef(null);

  const showAlert = (type, message, ms = 2500) => {
    setAlert({ type, message });
    if (ms) setTimeout(() => setAlert({ type: "success", message: "" }), ms);
  };

  const handleAdd = (data) => {
    if (editing) {
      updateMutation.mutate(
        { ...editing, ...data },
        {
          onSuccess: (updatedComment) => {
            showAlert("success", "Comment updated");
            setHighlightedId(updatedComment.id);
            setEditing(null);
          },
          onError: () => showAlert("error", "Failed to update comment"),
        }
      );
    } else {
      addMutation.mutate(data, {
        onSuccess: (newComment) => {
          showAlert("success", "Comment added");
          setHighlightedId(newComment.id);
        },
        onError: () => showAlert("error", "Failed to add comment"),
      });
    }
  };

  const handleEdit = (comment) => {
    setEditing(comment);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const requestDelete = (id) => setConfirm({ open: true, id });

  const confirmDelete = () => {
    const id = confirm.id;
    setConfirm({ open: false, id: null });
    deleteMutation.mutate(id, {
      onSuccess: () => showAlert("success", "Comment deleted"),
      onError: () => showAlert("error", "Failed to delete comment"),
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-2" ref={formRef}>
        Blog Comments
      </h1>

      <InlineAlert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "success", message: "" })}
      />

      <CommentForm onSubmit={handleAdd} initialData={editing} />

      <CommentList
        comments={comments}
        onEdit={handleEdit}
        onDelete={requestDelete}
        highlightedId={highlightedId}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}