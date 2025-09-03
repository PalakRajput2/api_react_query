export default function InlineAlert({ type = "success", message, onClose }) {
  if (!message) return null;

  const styles =
    type === "success"
      ? "bg-green-50 text-green-800 border-green-200"
      : "bg-red-50 text-red-800 border-red-200";

  return (
    <div className={`flex items-center justify-between border px-3 py-2 rounded ${styles}`}>
      <span className="text-sm">{message}</span>
      <button className="text-sm underline" onClick={onClose} type="button">
        Close
      </button>
    </div>
  );
}
