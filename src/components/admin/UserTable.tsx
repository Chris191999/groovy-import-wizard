
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddUserDialog from "@/components/admin/AddUserDialog";
import UserActions from "./UserActions";
import type { ProfileWithEmail } from "@/hooks/useAdminUsers";
import { Database } from "@/integrations/supabase/types";
import { formatBytes } from "@/utils/formatters";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserTableProps {
  profiles: ProfileWithEmail[];
  onUpdateUser: (id: string, updates: { status?: Profile['status'], role?: Profile['role'] }) => void;
  onDeleteUser: (profile: ProfileWithEmail) => void;
  onDeleteUserData: (profile: ProfileWithEmail) => void;
}

const UserTable = ({ profiles, onUpdateUser, onDeleteUser, onDeleteUserData }: UserTableProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <AddUserDialog />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Storage Used</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.full_name || "N/A"}</TableCell>
                <TableCell>{profile.email || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>{profile.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      profile.status === 'active'
                        ? 'success'
                        : profile.status === 'pending_approval'
                        ? 'warning'
                        : 'destructive'
                    }
                  >
                    {profile.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatBytes(profile.storage_used || 0)}</TableCell>
                <TableCell>
                  <UserActions profile={profile} onUpdate={onUpdateUser} onDelete={onDeleteUser} onDeleteData={onDeleteUserData} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserTable;
