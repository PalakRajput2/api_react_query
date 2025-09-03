import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
} from "../api/commentsApi";

export const useComments = () => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
    staleTime: 1000 * 60 * 5,
  });

  // Add new comment
  const addMutation = useMutation({
    mutationFn: addComment,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const prevComments = queryClient.getQueryData(["comments"]) || [];

      // Generate a truly unique temporary ID
      const tempId = `temp-${uuid()}-${Date.now()}`;
      const optimisticComment = { id: tempId, ...newComment };

      queryClient.setQueryData(["comments"], (old = []) => [
        optimisticComment,
        ...old,
      ]);

      return { prevComments, tempId };
    },
    onError: (err, newComment, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments"], context.prevComments);
      }
    },
    onSuccess: (savedComment, variables, context) => {
      queryClient.setQueryData(["comments"], (old = []) =>
        old.map((c) => (c.id === context.tempId ? savedComment : c))
      );
    },
  });

  // Update comment
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onMutate: async (updatedComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const prevComments = queryClient.getQueryData(["comments"]) || [];

      queryClient.setQueryData(["comments"], (old = []) =>
        old.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );

      return { prevComments };
    },
    onError: (err, variables, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments"], context.prevComments);
      }
    },
    onSuccess: (savedComment) => {
      // Ensure we have the latest data from server
      queryClient.setQueryData(["comments"], (old = []) =>
        old.map((c) => (c.id === savedComment.id ? savedComment : c))
      );
    },
  });

  // Delete comment 
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const prevComments = queryClient.getQueryData(["comments"]) || [];

      // Remove the comment with the exact ID
      queryClient.setQueryData(["comments"], (old = []) =>
        old.filter((c) => c.id !== id)
      );

      return { prevComments };
    },
    onError: (err, id, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments"], context.prevComments);
      }
    },
    onSuccess: (deletedId) => {
      // Final cleanup: remove any temporary comments that might have the same ID
      queryClient.setQueryData(["comments"], (old = []) =>
        old.filter((c) => {
          // If it's a temporary comment with the same base ID, remove it
          if (c.id.toString().includes(`temp-`) && c.id.toString().includes(deletedId)) {
            return false;
          }
          return c.id !== deletedId;
        })
      );
    },
  });

  return { comments, isLoading, addMutation, updateMutation, deleteMutation };
};