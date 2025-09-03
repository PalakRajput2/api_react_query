export default function ConfirmDialog({ open, title = "Confirm", message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded bg-gray-200 px-3 py-1.5"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded bg-red-600 px-3 py-1.5 text-white"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
