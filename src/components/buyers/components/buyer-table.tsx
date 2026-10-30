// import { ChevronLeft, ChevronRight, Eye, Pencil, Power, Trash2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import type { Buyer } from "@/lib/api/buyer.api";
// import { formatBuyerDate, PAGE_SIZE } from "../buyer-utils";
// // import { formatBuyerDate, PAGE_SIZE } from "../buyer.utils";

// type Props = {
//   buyers: Buyer[]; loading: boolean; loadError: boolean; total: number; page: number; totalPages: number; refreshing: boolean; updating: boolean; deleting: boolean;
//   onView: (buyer: Buyer) => void; onEdit: (buyer: Buyer) => void; onToggleStatus: (buyer: Buyer) => void; onDelete: (buyer: Buyer) => void; onPageChange: (page: number) => void;
// };

// export function BuyerTable({ buyers, loading, loadError, total, page, totalPages, refreshing, updating, deleting, onView, onEdit, onToggleStatus, onDelete, onPageChange }: Props) {
//   return (
//     <>
//       <div className="overflow-x-auto rounded-md border">
//         <Table>
//           <TableHeader><TableRow>
//             <TableHead>Buyer Code</TableHead><TableHead>Buyer Name</TableHead><TableHead>Country</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Created At</TableHead><TableHead className="text-right">Actions</TableHead>
//           </TableRow></TableHeader>
//           <TableBody>
//             {loading ? <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Loading buyers...</TableCell></TableRow>
//               : buyers.length === 0 ? <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">{loadError ? "Could not load buyers." : "No buyers found."}</TableCell></TableRow>
//               : buyers.map((buyer) => <TableRow key={buyer.id}>
//                 <TableCell className="font-medium">{buyer.code}</TableCell><TableCell>{buyer.name}</TableCell><TableCell>{buyer.country || "—"}</TableCell><TableCell>{buyer.email || "—"}</TableCell><TableCell>{buyer.phone || "—"}</TableCell>
//                 <TableCell><Badge variant={buyer.isActive ? "default" : "secondary"}>{buyer.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell>{formatBuyerDate(buyer.createdAt)}</TableCell>
//                 <TableCell><div className="flex justify-end gap-1">
//                   <Button type="button" variant="ghost" size="icon" aria-label={`View ${buyer.name}`} title="View details" onClick={() => onView(buyer)}><Eye className="h-4 w-4" /></Button>
//                   <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${buyer.name}`} title="Edit buyer" onClick={() => onEdit(buyer)}><Pencil className="h-4 w-4" /></Button>
//                   <Button type="button" variant="ghost" size="icon" aria-label={`${buyer.isActive ? "Deactivate" : "Activate"} ${buyer.name}`} title={buyer.isActive ? "Deactivate buyer" : "Activate buyer"} onClick={() => onToggleStatus(buyer)} disabled={updating}><Power className={`h-4 w-4 ${buyer.isActive ? "text-muted-foreground" : "text-green-600"}`} /></Button>
//                   <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${buyer.name}`} title="Delete buyer" onClick={() => onDelete(buyer)} disabled={deleting}><Trash2 className="h-4 w-4 text-destructive" /></Button>
//                 </div></TableCell>
//               </TableRow>)}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <p className="text-sm text-muted-foreground">{total === 0 ? "Showing 0 buyers" : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} buyers`}</p>
//         <div className="flex items-center gap-2">
//           <Button type="button" variant="outline" size="sm" disabled={page <= 1 || refreshing} onClick={() => onPageChange(Math.max(1, page - 1))}><ChevronLeft className="mr-1 h-4 w-4" /> Previous</Button>
//           <span className="text-sm">Page {page} of {totalPages}</span>
//           <Button type="button" variant="outline" size="sm" disabled={page >= totalPages || refreshing} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
//         </div>
//       </div>
//     </>
//   );
// }


import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Buyer } from "@/lib/api/buyer.api";
import { formatBuyerDate, PAGE_SIZE } from "../buyer-utils";
// import { formatBuyerDate, PAGE_SIZE } from "../buyer.utils";

type Props = {
  buyers: Buyer[];
  loading: boolean;
  loadError: boolean;
  total: number;
  page: number;
  totalPages: number;
  refreshing: boolean;
  updating: boolean;
  deleting: boolean;
  onView: (buyer: Buyer) => void;
  onEdit: (buyer: Buyer) => void;
  onToggleStatus: (buyer: Buyer) => void;
  onDelete: (buyer: Buyer) => void;
  onPageChange: (page: number) => void;
};

export function BuyerTable({
  buyers,
  loading,
  loadError,
  total,
  page,
  totalPages,
  refreshing,
  updating,
  deleting,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  onPageChange,
}: Props) {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Buyer Code</TableHead>
              <TableHead>Buyer Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading buyers...
                </TableCell>
              </TableRow>
            ) : buyers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  {loadError ? "Could not load buyers." : "No buyers found."}
                </TableCell>
              </TableRow>
            ) : (
              buyers.map((buyer) => (
                <TableRow key={buyer.id} className="group">
                  <TableCell className="font-medium">
                    {buyer.code}
                  </TableCell>

                  <TableCell>{buyer.name}</TableCell>
                  <TableCell>{buyer.country || "—"}</TableCell>
                  <TableCell>{buyer.email || "—"}</TableCell>
                  <TableCell>{buyer.phone || "—"}</TableCell>

                  <TableCell>
                    <Badge
                      variant={buyer.isActive ? "default" : "secondary"}
                    >
                      {buyer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {formatBuyerDate(buyer.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          aria-label={`Actions for ${buyer.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className="w-48"
                      >
                        <DropdownMenuItem
                          onSelect={() => onView(buyer)}
                        >
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                          View details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={() => onEdit(buyer)}
                        >
                          <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                          Edit buyer
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={() => onToggleStatus(buyer)}
                          disabled={updating}
                        >
                          <Power className="mr-2 h-4 w-4 text-muted-foreground" />
                          {buyer.isActive
                            ? "Deactivate buyer"
                            : "Activate buyer"}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onSelect={() => onDelete(buyer)}
                          disabled={deleting}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete buyer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "Showing 0 buyers"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                page * PAGE_SIZE,
                total
              )} of ${total} buyers`}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || refreshing}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages || refreshing}
            onClick={() =>
              onPageChange(Math.min(totalPages, page + 1))
            }
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
