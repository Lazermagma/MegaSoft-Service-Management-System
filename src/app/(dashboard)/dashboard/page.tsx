import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  { title: "Total Users", value: "—" },
  { title: "Total Assets", value: "—" },
  { title: "Open Requests", value: "—" },
  { title: "Maintenance Logs", value: "—" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of users, assets, service requests, and maintenance activity."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
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
            <p className="text-sm text-muted-foreground">
              Service request data will appear here.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
