import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner';

const useFollow = () => {
 const queryClient = useQueryClient();

 const {mutate: followUser, isPending}  = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/follow/${userId}`, {
          method: "POST",
          credentials: "include", // Include cookies in the request to maintain session
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to follow user");

        return data;
      } catch (error) {
        console.error("Error following user:", error);
        throw new Error(error);
      }
    },
    onSuccess: () =>{

        Promise.all([
            queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }), // Invalidate the authUser query to refetch user data
            queryClient.invalidateQueries({ queryKey: ["authUser"] })// Invalidate the authUser query to refetch user data

        ])
        toast.success("User followed successfully");
    },
    onError: (error) => {
        toast.error(error.message || "Failed to follow user");
    }
 });

 return { followUser, isPending };
}

export default useFollow