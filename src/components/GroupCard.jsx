import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
export default function GroupCard({ group }) {
  return (
    <Card className="bg-black text-white shadow-lg border border-white border-solid">
      <CardContent>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{group.name}</CardTitle>
      </CardHeader>
        {/* <p className="text-gray-300 mb-3">{group.description}</p> */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <p>{group?.members?.length} Members</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" className="text-gray-300 border-gray-600">
          open
        </Button>
      </CardFooter>
    </Card>
  );
}
