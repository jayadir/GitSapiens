import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import Announcements from "../../../components/Announcements";
import MyAnnouncements from "../../../components/MyAnnouncements";
export default function page() {
  return (
    <div className="overflow-y-scroll h-full p-2">
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="my-announcements">My Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements">
            <Announcements />
        </TabsContent>
        <TabsContent value="my-announcements">
            <MyAnnouncements />
        </TabsContent>
      </Tabs>
    </div>
  );
}
