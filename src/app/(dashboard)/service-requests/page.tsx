import { getAssets, getAssignableUsers } from "@/actions/assets";
import { getServiceRequests } from "@/actions/service-requests";
import { getTechnicians } from "@/actions/users";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceRequestsTable } from "@/components/service-requests/service-requests-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function ServiceRequestsPage() {
  const [
    { data: requests, error: requestsError },
    { data: users, error: usersError },
    { data: technicians, error: techniciansError },
    { data: assets, error: assetsError },
  ] = await Promise.all([
    getServiceRequests(),
    getAssignableUsers(),
    getTechnicians(),
    getAssets(),
  ]);

  const error =
    requestsError ?? usersError ?? techniciansError ?? assetsError;

  const assetOptions = assets.map(({ asset_id, asset_name }) => ({
    asset_id,
    asset_name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Requests"
        description="Create, assign, and track service tickets."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load service requests</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <ServiceRequestsTable
        requests={requests}
        users={users}
        technicians={technicians}
        assets={assetOptions}
      />
    </div>
  );
}
