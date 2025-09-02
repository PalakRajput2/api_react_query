import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//  Fetch comments
export const fetchComments = async () => {
  const { data } = await axios.get(`${API_URL}?_limit=5`);
  return data;
};

//  Add comment
export const addComment = async (comment) => {
  const { data } = await axios.post(API_URL, comment);
  return data;
};

//  Update comment
export const updateComment = async (comment) => {
  const { data } = await axios.put(`${API_URL}/${comment.id}`, comment);
  return data;
};

// Delete comment
export const deleteComment = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};
