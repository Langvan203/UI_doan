"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Bell, CheckCircle } from "lucide-react"
import { DashboardSummaryCard } from "@/components/dashboard/dashboard-summary-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function DashboardCustomerService() {
  // In a real app, you would fetch this data from an API
  const totalResidents = 245
  const activeTickets = 18
  const resolvedTickets = 124
  const pendingAnnouncements = 3

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardSummaryCard
          title="Total Residents"
          value={totalResidents.toString()}
          icon={<Users className="h-5 w-5 text-[#7c3aed]" />}
          description="Registered residents"
          trend={{ value: "+12", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Active Tickets"
          value={activeTickets.toString()}
          icon={<MessageSquare className="h-5 w-5 text-[#7c3aed]" />}
          description="Support tickets in progress"
          trend={{ value: "-3", direction: "down", label: "from last week" }}
        />
        <DashboardSummaryCard
          title="Resolved Tickets"
          value={resolvedTickets.toString()}
          icon={<CheckCircle className="h-5 w-5 text-[#7c3aed]" />}
          description="Tickets resolved this month"
          trend={{ value: "+15", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Pending Announcements"
          value={pendingAnnouncements.toString()}
          icon={<Bell className="h-5 w-5 text-[#7c3aed]" />}
          description="Announcements to be sent"
          trend={{ value: "+1", direction: "up", label: "from yesterday" }}
        />
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="residents">Residents</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Recent Support Tickets</CardTitle>
                <CardDescription>Latest support requests from residents</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Search tickets..." className="w-[250px]" />
                <Button asChild>
                  <Link href="/dashboard/support/new">Create Ticket</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "TKT-1001",
                    title: "Water leakage in bathroom",
                    resident: "Nguyễn Văn A",
                    unit: "A1203",
                    status: "urgent",
                    time: "2 hours ago",
                  },
                  {
                    id: "TKT-1002",
                    title: "Air conditioner not working",
                    resident: "Trần Thị B",
                    unit: "B0502",
                    status: "open",
                    time: "5 hours ago",
                  },
                  {
                    id: "TKT-1003",
                    title: "Noise complaint from neighbor",
                    resident: "Lê Văn C",
                    unit: "A0803",
                    status: "in-progress",
                    time: "1 day ago",
                  },
                  {
                    id: "TKT-1004",
                    title: "Request for additional parking space",
                    resident: "Phạm Thị D",
                    unit: "C1105",
                    status: "open",
                    time: "2 days ago",
                  },
                  {
                    id: "TKT-1005",
                    title: "Internet connection issues",
                    resident: "Hoàng Văn E",
                    unit: "B0901",
                    status: "in-progress",
                    time: "2 days ago",
                  },
                ].map((ticket, i) => (
                  <div key={i} className="flex items-start justify-between rounded-lg border p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={ticket.resident} />
                        <AvatarFallback>{ticket.resident.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{ticket.title}</p>
                          <Badge
                            variant={
                              ticket.status === "urgent"
                                ? "destructive"
                                : ticket.status === "in-progress"
                                  ? "outline"
                                  : "default"
                            }
                          >
                            {ticket.status === "urgent"
                              ? "Urgent"
                              : ticket.status === "in-progress"
                                ? "In Progress"
                                : "Open"}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {ticket.resident} ({ticket.unit})
                          </span>
                          <span>•</span>
                          <span>{ticket.id}</span>
                          <span>•</span>
                          <span>{ticket.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/support/${ticket.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="residents" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Resident Directory</CardTitle>
                <CardDescription>Manage resident information</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Search residents..." className="w-[250px]" />
                <Button asChild>
                  <Link href="/dashboard/residents/new">Add Resident</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b p-3 font-medium">
                  <div>Name</div>
                  <div>Unit</div>
                  <div>Contact</div>
                  <div>Move-in Date</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-6 border-b p-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Resident" />
                        <AvatarFallback>{["NVA", "TTB", "LVC", "PTD", "HVE"][i]}</AvatarFallback>
                      </Avatar>
                      <span>{["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"][i]}</span>
                    </div>
                    <div>{["A1203", "B0502", "A0803", "C1105", "B0901"][i]}</div>
                    <div>{["0901234567", "0912345678", "0923456789", "0934567890", "0945678901"][i]}</div>
                    <div>{new Date(2023, i, 15).toLocaleDateString()}</div>
                    <div>
                      <Badge variant={i % 4 === 0 ? "outline" : "default"}>{i % 4 === 0 ? "New" : "Active"}</Badge>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/residents/${i + 1}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/support/new?resident=${i + 1}`}>Support</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Create and manage building announcements</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/announcements/new">Create Announcement</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Building Maintenance Notice</CardTitle>
                      <Badge>Scheduled</Badge>
                    </div>
                    <CardDescription>To be sent on: May 8, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      The water supply will be temporarily interrupted on May 10, 2025, from 10:00 AM to 2:00 PM for
                      scheduled maintenance. Please store enough water for use during this period. We apologize for any
                      inconvenience.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Target: All Buildings</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Send Now</Button>
                    </div>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Community Event</CardTitle>
                      <Badge>Scheduled</Badge>
                    </div>
                    <CardDescription>To be sent on: May 10, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Join us for the monthly community gathering in the central garden area on May 15, 2025, at 5:00
                      PM. There will be food, drinks, and activities for all ages. This is a great opportunity to meet
                      your neighbors and build community connections.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Target: All Residents</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Send Now</Button>
                    </div>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Fire Drill Notice</CardTitle>
                      <Badge>Scheduled</Badge>
                    </div>
                    <CardDescription>To be sent on: May 12, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      A fire drill will be conducted on May 20, 2025, from 9:00 AM to 10:00 AM. All residents are
                      required to participate and follow the evacuation procedures. Building staff will be available to
                      assist and guide residents during the drill.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Target: All Buildings</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Send Now</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Live Chat Support</CardTitle>
              <CardDescription>Chat with residents in real-time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="grid h-full grid-cols-3 gap-4">
                <div className="col-span-1 rounded-lg border">
                  <div className="p-3 border-b font-medium">Active Conversations</div>
                  <div className="divide-y">
                    {[
                      { name: "Nguyễn Văn A", unit: "A1203", time: "2m ago", unread: true },
                      { name: "Trần Thị B", unit: "B0502", time: "15m ago", unread: false },
                      { name: "Lê Văn C", unit: "A0803", time: "1h ago", unread: false },
                      { name: "Phạm Thị D", unit: "C1105", time: "3h ago", unread: false },
                    ].map((chat, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer ${
                          i === 0 ? "bg-accent" : ""
                        }`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={chat.name} />
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{chat.name}</p>
                            <p className="text-xs text-muted-foreground">{chat.time}</p>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">Unit: {chat.unit}</p>
                        </div>
                        {chat.unread && (
                          <Badge variant="destructive" className="h-2 w-2 rounded-full p-0">
                            <span className="sr-only">Unread messages</span>
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 flex flex-col rounded-lg border">
                  <div className="border-b p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt="Nguyễn Văn A" />
                        <AvatarFallback>NVA</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Nguyễn Văn A</p>
                        <p className="text-sm text-muted-foreground">Unit: A1203</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Nguyễn Văn A" />
                        <AvatarFallback>NVA</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-accent p-3">
                        <p>Hello, I'm having an issue with my water heater. It's not working since this morning.</p>
                        <p className="mt-1 text-xs text-muted-foreground">10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end gap-2">
                      <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                        <p>
                          Hi Mr. Nguyễn, I understand your concern. I'll send a maintenance technician to check your
                          water heater today.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">10:32 AM</p>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Support Agent" />
                        <AvatarFallback>CS</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Nguyễn Văn A" />
                        <AvatarFallback>NVA</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-accent p-3">
                        <p>Thank you! What time should I expect the technician?</p>
                        <p className="mt-1 text-xs text-muted-foreground">10:33 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end gap-2">
                      <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                        <p>
                          The technician will arrive between 2:00 PM and 4:00 PM today. Please make sure someone is
                          available to let them in.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">10:35 AM</p>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Support Agent" />
                        <AvatarFallback>CS</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="border-t p-3">
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." className="flex-1" />
                      <Button>Send</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
