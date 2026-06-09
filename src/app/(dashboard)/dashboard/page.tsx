import { getDashboardData } from "@/actions/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  priorityVariant,
  requestStatusVariant,
} from "@/lib/constants/statuses";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
  const { stats, recentRequests, error } = await getDashboardData();

  const cards = [
    { title: "Total Users", value: stats.userCount },
    { title: "Total Assets", value: stats.assetCount },
    { title: "Open Requests", value: stats.openRequestCount },
    { title: "Maintenance Logs", value: stats.maintenanceLogCount },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of users, assets, service requests, and maintenance activity."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load dashboard data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={error ? "—" : String(card.value)}
          />
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Open Service Requests</CardTitle>
            <CardDescription>
              Latest requests waiting for action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      No open service requests.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentRequests.map((request) => (
                    <TableRow key={request.request_id}>
                      <TableCell className="font-medium">
                        {request.title}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={request.priority}
                          variant={priorityVariant[request.priority]}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={request.status}
                          variant={requestStatusVariant[request.status]}
                        />
                      </TableCell>
                      <TableCell>{request.asset?.asset_type ?? "—"}</TableCell>
                      <TableCell>
                        {request.assigned_to?.full_name ?? "Unassigned"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
