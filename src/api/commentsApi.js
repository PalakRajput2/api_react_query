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

// Add comment 
export const addComment = async (comment) => {
  try {
    const { data } = await axios.post(API_URL, comment);
    return { ...data, id: Date.now() }; // Generate unique ID locally
  } catch (error) {
    console.error("Error adding comment:", error);
     return { ...comment, id: Date.now() };
  }
};

// Update comment 
export const updateComment = async (comment) => {
  try {
      const { data } = await axios.patch(`${API_URL}/${comment.id}`, comment);
    return data;
  } catch (error) {
    console.error("Error updating comment:", error);
      return comment;
  }
};

// Delete comment 
export const deleteComment = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting comment:", error);
     return id;
  }
};