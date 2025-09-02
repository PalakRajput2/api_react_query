import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add new comment at TOP
  const addMutation = useMutation({
    mutationFn: addComment,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["comments"]);
      const prevComments = queryClient.getQueryData(["comments"]);

      const tempId = Date.now();
      const optimisticComment = { id: tempId, ...newComment };

      queryClient.setQueryData(["comments"], (old = []) => [
        optimisticComment,
        ...old,
      ]);

      return { prevComments, tempId };
    },
    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(["comments"], context.prevComments);
    },
    onSuccess: (savedComment, _newComment, context) => {
      queryClient.setQueryData(["comments"], (old = []) =>
        old.map((c) => (c.id === context.tempId ? savedComment : c))
      );
    },
  });

  //  Update comment
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onMutate: async (updatedComment) => {
      await queryClient.cancelQueries(["comments"]);
      const prevComments = queryClient.getQueryData(["comments"]);

      queryClient.setQueryData(["comments"], (old = []) =>
        old.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );

      return { prevComments };
    },
    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(["comments"], context.prevComments);
    },
    onSuccess: (savedComment) => {
      queryClient.setQueryData(["comments"], (old = []) =>
        old.map((c) => (c.id === savedComment.id ? savedComment : c))
      );
    },
  });

  // Delete comment
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (id) => {
      await queryClient.cancelQueries(["comments"]);
      const prevComments = queryClient.getQueryData(["comments"]);

      queryClient.setQueryData(["comments"], (old = []) =>
        old.filter((c) => c.id !== id)
      );

      return { prevComments };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["comments"], context.prevComments);
    },
  });

  return { comments, isLoading, addMutation, updateMutation, deleteMutation };
};
