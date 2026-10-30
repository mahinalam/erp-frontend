import { Users, UserCheck, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = { total: number; active: number; inactive: number };

export function BuyerStats({ total, active, inactive }: Props) {
  const stats = [
    { label: "Total Buyers", value: total, Icon: Users },
    { label: "Active on This Page", value: active, Icon: UserCheck },
    { label: "Inactive on This Page", value: inactive, Icon: UserX },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map(({ label, value, Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
            <div className="rounded-lg bg-muted p-3"><Icon className="h-5 w-5" /></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
