import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch comments
export const fetchComments = async () => {
  try {
    const { data } = await axios.get(`${API_URL}?_limit=5`);
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    // Return mock data as fallback
    return [
      {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        body: "This is a test comment"
      }
    ];
  }
};

// Add comment - JSONPlaceholder doesn't actually create, so we simulate
export const addComment = async (comment) => {
  try {
    // JSONPlaceholder returns mock data but doesn't persist
    const { data } = await axios.post(API_URL, comment);
    return { ...data, id: Date.now() }; // Generate unique ID locally
  } catch (error) {
    console.error("Error adding comment:", error);
    // Simulate success response
    return { ...comment, id: Date.now() };
  }
};

// Update comment - JSONPlaceholder often fails with PUT
export const updateComment = async (comment) => {
  try {
    // Use PATCH instead of PUT as it's more reliable with JSONPlaceholder
    const { data } = await axios.patch(`${API_URL}/${comment.id}`, comment);
    return data;
  } catch (error) {
    console.error("Error updating comment:", error);
    // If update fails, return the comment as if it succeeded
    return comment;
  }
};

// Delete comment - JSONPlaceholder doesn't actually delete
export const deleteComment = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting comment:", error);
    // Still return the ID as if deletion succeeded
    return id;
  }
};