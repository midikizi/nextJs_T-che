"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import LogoutButton from "./LogoutButton";

export function Header() {
  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Citation Maker</CardTitle>
        <LogoutButton />
      </CardHeader>
    </Card>
  );
}