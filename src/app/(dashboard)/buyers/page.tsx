"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBuyers } from "@/lib/api/buyer";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BuyersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useQuery({
    queryKey: ["buyers", page, search, country, isActive, sortBy, order],
    queryFn: () =>
      fetchBuyers({
        page,
        limit: 10,
        search,
        country,
        isActive,
        sortBy,
        order,
      }),
  });

  // const buyers = data?.data || [];
  const buyers = [
    {
      name: "H&M",
      code: "BUY001",
      country: "Sweden",
      email: "sourcing@hm.com",
      phone: "+46 8 796 5500",
      isActive: true,
    },
    {
      name: "Zara",
      code: "BUY002",
      country: "Spain",
      email: "procurement@zara.com",
      phone: "+34 981 185 400",
      isActive: true,
    },
    {
      name: "Uniqlo",
      code: "BUY003",
      country: "Japan",
      email: "buyers@uniqlo.com",
      phone: "+81 3 6865 0000",
      isActive: true,
    },
    {
      name: "Primark",
      code: "BUY004",
      country: "Ireland",
      email: "orders@primark.com",
      phone: "+353 1 878 4900",
      isActive: true,
    },
    {
      name: "C&A",
      code: "BUY005",
      country: "Germany",
      email: "merchandising@canda.com",
      phone: "+49 211 98720",
      isActive: true,
    },
    {
      name: "Target",
      code: "BUY006",
      country: "United States",
      email: "vendor@target.com",
      phone: "+1 612 304 6073",
      isActive: true,
    },
    {
      name: "Walmart",
      code: "BUY007",
      country: "United States",
      email: "globalsourcing@walmart.com",
      phone: "+1 479 273 4000",
      isActive: true,
    },
    {
      name: "Marks & Spencer",
      code: "BUY008",
      country: "United Kingdom",
      email: "suppliers@marksandspencer.com",
      phone: "+44 20 7935 4422",
      isActive: true,
    },
    {
      name: "Next",
      code: "BUY009",
      country: "United Kingdom",
      email: "buying@next.co.uk",
      phone: "+44 116 284 7788",
      isActive: true,
    },
    {
      name: "PVH Corp",
      code: "BUY010",
      country: "United States",
      email: "vendors@pvh.com",
      phone: "+1 212 381 3500",
      isActive: false,
    },
  ];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Buyers</h1>
        <Button>+ Add Buyer</Button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setCountry(e.target.value)}>
          <option value="">Country</option>
          <option value="Bangladesh">Bangladesh</option>
          <option value="USA">USA</option>
        </select>

        <select onChange={(e) => setIsActive(e.target.value)}>
          <option value="">Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
              >
                Name
              </TableHead>

              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* {!isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : ( */}
            {buyers.map((b: any) => (
              <TableRow key={b.id}>
                <TableCell>{b.code}</TableCell>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.country}</TableCell>
                <TableCell>
                  {b.isActive ? (
                    <Badge>Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {/* // )} */}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between">
        <p>
          Page {meta?.page} of {meta?.lastPage}
        </p>

        <div className="flex gap-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>

          <Button
            disabled={page === meta?.lastPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
