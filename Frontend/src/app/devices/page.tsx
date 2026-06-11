"use client";

import { motion } from "framer-motion";
import DeviceTable from "@/components/devices/DeviceTable";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, Loader2 } from "lucide-react";
import { useState, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

export default function DevicesPage() {
  const [syncKey, setSyncKey] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("hvac");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncKey(prev => prev + 1);
    setTimeout(() => setIsSyncing(false), 500);
  };

  const handleAddDevice = async () => {
    if (!deviceName) return;
    setIsSubmitting(true);
    try {
      await api.devices.create({
        name: deviceName,
        type: deviceType,
        room_id: "00000000-0000-0000-0000-000000000000",
        status: "online"
      });
      setIsAddOpen(false);
      setDeviceName("");
      handleSync(); // Refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to add device");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Device Monitoring</h1>
          <p className="text-muted-foreground mt-1">Manage and track the health of your connected infrastructure.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <Button variant="outline" size="sm" className="gap-2 h-10" onClick={handleSync} disabled={isSyncing}>
            <RefreshCcw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
            {isSyncing ? "Syncing..." : "Sync Devices"}
          </Button>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="gap-2 h-10">
                <Plus className="h-4 w-4" /> Add Device
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogDescription>
                  Enter the details of the new IoT device to begin tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" placeholder="e.g. Main Lobby HVAC" className="col-span-3" value={deviceName} onChange={e => setDeviceName(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <div className="col-span-3">
                    <Select value={deviceType} onValueChange={setDeviceType}>
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
                <Button onClick={handleAddDevice} disabled={isSubmitting || !deviceName}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Register Device
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Suspense fallback={<div className="h-40 flex items-center justify-center border border-border rounded-xl text-muted-foreground">Loading Devices...</div>}>
          <DeviceTable key={syncKey} />
        </Suspense>
      </motion.div>
    </div>
  );
}
