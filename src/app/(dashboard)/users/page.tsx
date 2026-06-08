import { getDepartments, getUsers } from "@/actions/users";
import { PageHeader } from "@/components/layout/page-header";
import { UsersTable } from "@/components/users/users-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function UsersPage() {
  const [{ data: users, error: usersError }, { data: departments, error: deptError }] =
    await Promise.all([getUsers(), getDepartments()]);

  const error = usersError ?? deptError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage employees, technicians, and admins by department."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load users</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <UsersTable users={users} departments={departments} />
    </div>
  );
}
