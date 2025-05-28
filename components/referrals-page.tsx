"use client"

import { useState } from "react"
import { Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAccount } from "@/components/account-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function ReferralsPage() {
  const { currentAccount } = useAccount()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSource, setFilterSource] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredReferrals = referrals
    .filter((referral) => {
      if (filterSource !== "all" && referral.source.toLowerCase() !== filterSource) {
        return false
      }
      if (
        searchQuery &&
        !referral.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !referral.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name)
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Referrals</h1>
          <p className="text-muted-foreground">Track all users who signed up through your links</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Referral List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Discord ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.map((referral, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{referral.name}</TableCell>
                  <TableCell>{referral.email}</TableCell>
                  <TableCell>{referral.source}</TableCell>
                  <TableCell>{referral.discordId}</TableCell>
                  <TableCell>{referral.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.3%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">YouTube</div>
            <p className="text-xs text-muted-foreground">89 conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27.5</div>
            <p className="text-xs text-muted-foreground">From 324 referrals</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const referrals = [
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    source: "YouTube",
    age: 24,
    discordId: "sarah#1234",
    date: "May 12, 2023",
  },
  {
    name: "Mike Peterson",
    email: "mike.p@example.com",
    source: "Instagram",
    age: 31,
    discordId: "mikep#5678",
    date: "May 10, 2023",
  },
  {
    name: "Emma Wilson",
    email: "emma.w@example.com",
    source: "TikTok",
    age: 28,
    discordId: "emmaw#9012",
    date: "May 8, 2023",
  },
  {
    name: "Alex Thompson",
    email: "alex.t@example.com",
    source: "YouTube",
    age: 22,
    discordId: "alext#3456",
    date: "May 5, 2023",
  },
  {
    name: "Jessica Brown",
    email: "jessica.b@example.com",
    source: "Instagram",
    age: 26,
    discordId: "jessb#7890",
    date: "May 3, 2023",
  },
  {
    name: "David Miller",
    email: "david.m@example.com",
    source: "Twitter",
    age: 29,
    discordId: "davidm#1234",
    date: "May 1, 2023",
  },
  {
    name: "Sophia Garcia",
    email: "sophia.g@example.com",
    source: "YouTube",
    age: 25,
    discordId: "sophiag#5678",
    date: "April 28, 2023",
  },
  {
    name: "James Wilson",
    email: "james.w@example.com",
    source: "TikTok",
    age: 32,
    discordId: "jamesw#9012",
    date: "April 25, 2023",
  },
]
