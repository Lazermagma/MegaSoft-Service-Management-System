import { getAssets } from "@/actions/assets";
import { getMaintenanceLogs } from "@/actions/maintenance-logs";
import { getTechnicians } from "@/actions/users";
import { PageHeader } from "@/components/layout/page-header";
import { MaintenanceLogsTable } from "@/components/maintenance-logs/maintenance-logs-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function MaintenanceLogsPage() {
  const [
    { data: logs, error: logsError },
    { data: assets, error: assetsError },
    { data: technicians, error: techniciansError },
  ] = await Promise.all([
    getMaintenanceLogs(),
    getAssets(),
    getTechnicians(),
  ]);

  const error = logsError ?? assetsError ?? techniciansError;

  const assetOptions = assets.map(({ asset_id, asset_type }) => ({
    asset_id,
    asset_type,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Logs"
        description="Record and review asset maintenance history."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load maintenance logs</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <MaintenanceLogsTable
        logs={logs}
        assets={assetOptions}
        technicians={technicians}
      />
    </div>
  );
}
