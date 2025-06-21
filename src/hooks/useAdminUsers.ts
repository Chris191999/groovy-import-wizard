import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";

type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileWithEmail = Profile & { email: string | null; storage_used: number };
type UserUpdatePayload = { userId: string, status?: Profile['status'], role?: Profile['role'] };

const fetchProfilesWithEmail = async () => {
  const { data, error } = await supabase.rpc("get_profiles_with_email");
  if (error) throw new Error(error.message);
  if (!data) return [];
  return (data as any[]).map(profile => ({
    ...profile,
    storage_used: Number(profile.storage_used || 0)
  })) as ProfileWithEmail[];
};

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: profiles, isLoading, error } = useQuery<ProfileWithEmail[]>({
    queryKey: ["profiles"],
    queryFn: fetchProfilesWithEmail,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, status, role }: UserUpdatePayload) => {
      const { error } = await supabase.functions.invoke("update-user-status", {
        body: { userId, status, role },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userIdToDelete: userId },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteUserDataMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.functions.invoke("delete-user-data", {
        body: { userIdToDelete: userId },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["storage-stats"] });
      toast.success("User data deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete user data: ${error.message}`);
    },
  });
  
  const handleUpdateUser = (userId: string, updates: { status?: Profile['status'], role?: Profile['role'] }) => {
    updateUserMutation.mutate({ userId, ...updates });
  };
  
  const handleDeleteUser = (profileToDelete: ProfileWithEmail) => {
    deleteUserMutation.mutate(profileToDelete.id);
  };

  const handleDeleteUserData = (profileToDelete: ProfileWithEmail) => {
    deleteUserDataMutation.mutate(profileToDelete.id);
  };

  return {
    profiles,
    isLoading,
    error,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    deleteUserData: handleDeleteUserData,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
    isDeletingData: deleteUserDataMutation.isPending,
  };
};
