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
  const [lastEditedId, setLastEditedId] = useState(null); 

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
            setLastEditedId(updatedComment.id); // ✅ highlight after update
          },
          onError: () => showAlert("error", "Failed to update"),
        }
      );
      setEditing(null);
    } else {
      addMutation.mutate(data, {
        onSuccess: (newComment) => {
          showAlert("success", "Comment added");
          setLastEditedId(newComment.id); // ✅ highlight new comment too
        },
        onError: () => showAlert("error", "Failed to add"),
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
      onError: () => showAlert("error", "Failed to delete"),
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

      {/* ✅ use CommentList here */}
      <CommentList
        comments={comments}
        onEdit={handleEdit}
        onDelete={requestDelete}
        lastEditedId={lastEditedId}
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
