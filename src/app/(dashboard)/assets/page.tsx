import { getAssignableUsers, getAssets } from "@/actions/assets";
import { PageHeader } from "@/components/layout/page-header";
import { AssetsTable } from "@/components/assets/assets-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function AssetsPage() {
  const [{ data: assets, error: assetsError }, { data: users, error: usersError }] =
    await Promise.all([getAssets(), getAssignableUsers()]);

  const error = assetsError ?? usersError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Manage company assets and assignments."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load assets</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <AssetsTable assets={assets} users={users} />
    </div>
  );
}
