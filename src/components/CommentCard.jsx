export default function CommentCard({ comment, onEdit, onDelete }) {
  return (
    <div className="border p-5 rounded shadow flex flex-col gap-2 justify-between items-start">
      <div>
          <p>{comment.email}</p>
        <h3 className="font-semibold">{comment.name}</h3>
        <p>{comment.body}</p>
      
      </div>
      <div className="space-x-3">
        <button
          onClick={() => onEdit(comment)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(comment.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      
      >
          Delete
        </button>
      </div>
    </div>
  );
}
