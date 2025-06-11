import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    const {mutateAsync:updateProfile, isLoading:isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch(`http://localhost:5000/api/users/update`, {
					method: "POST",
					credentials: "include", // Include cookies in the request to maintain session
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(formData)
				});

                const data = await res.json();
                
				if(!res.ok) {
					throw new Error( data.error ||"Failed to update profile");
				}

				return data;
				
			} catch (error) {
				console.error("Error updating profile:", error);
				throw new Error(error);
				
			}
		},
		onSuccess: () => {
			toast.success("profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }), // Invalidate the authUser query to refetch user data
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }) // Invalidate the userProfile query to refetch user data
			]);
		},
        onError: (error) => {
            toast.error(error.message );
        }

	})
    return { updateProfile, isUpdatingProfile };
}

export default useUpdateUserProfile;