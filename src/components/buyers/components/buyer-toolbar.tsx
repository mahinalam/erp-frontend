import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BuyerStatusFilter } from "../buyer-utils";

type Props = {
  search: string;
  status: BuyerStatusFilter;
  refreshing: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: BuyerStatusFilter) => void;
  onRefresh: () => void;
};

export function BuyerToolbar({ search, status, refreshing, onSearchChange, onStatusChange, onRefresh }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search name, code, country..." className="pl-9" aria-label="Search buyers" />
      </div>
      <select aria-label="Filter buyers by status" value={status} onChange={(event) => onStatusChange(event.target.value as BuyerStatusFilter)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
        <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
      </select>
      <Button type="button" variant="outline" onClick={onRefresh} disabled={refreshing}>
        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
      </Button>
    </div>
  );
}
