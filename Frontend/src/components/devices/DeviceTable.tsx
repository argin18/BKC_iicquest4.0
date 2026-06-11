import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Device } from "@/lib/types";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function DeviceTable() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState("All");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await api.devices.list();
      setDevices(data as Device[]);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleEditSubmit = async () => {
    if (!editingDevice || !editName) return;
    setIsSubmitting(true);
    try {
      await api.devices.update(editingDevice.id, {
        name: editName,
        type: editType
      });
      setEditingDevice(null);
      fetchDevices(); // Refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update device");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      await api.devices.delete(id);
      fetchDevices(); // Refresh
    } catch (err) {
      console.error(err);
      alert("Failed to delete device");
    }
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (device.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.room_id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || device.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online": return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Online</Badge>;
      case "warning": return <Badge variant="warning" className="gap-1"><AlertCircle className="h-3 w-3" /> Warning</Badge>;
      case "offline": return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Offline</Badge>;
      case "maintenance": return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Maintenance</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-success";
    if (health >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg">Device Status Grid</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <Filter className="h-4 w-4" /> {statusFilter === "All" ? "Filter" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("All")}>All Devices</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Online")}>Online</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Warning")}>Warning</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Offline")}>Offline</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Device Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Consumption</TableHead>
              <TableHead className="text-right">Efficiency</TableHead>
              <TableHead className="text-center">Health</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : filteredDevices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No devices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDevices.map((device, i) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{device.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{device.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{device.location || "Default Location"}</TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell className="text-right font-mono tracking-tight">
                    {(device.consumption ?? device.baseline_consumption ?? 0) !== 0 ? `${device.consumption ?? device.baseline_consumption} kWh` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {device.efficiency !== undefined && device.efficiency > 0 ? (
                      <span className={device.efficiency < 80 ? "text-warning" : "text-success"}>
                        {device.efficiency}%
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${getHealthColor(device.health || device.health_score || 100)}`}>
                      {Math.round(device.health || device.health_score || 100)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingDevice(device);
                          setEditName(device.name);
                          setEditType(device.type);
                        }}>Edit Device</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(device.id)}>Delete Device</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={!!editingDevice} onOpenChange={(open) => !open && setEditingDevice(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Update the details for this connected device.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input id="edit-name" className="col-span-3" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">Type</Label>
              <div className="col-span-3">
                <Select value={editType} onValueChange={setEditType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="meter">Smart Meter</SelectItem>
                    <SelectItem value="sensor">Sensor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit} disabled={isSubmitting || !editName}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
