"use client";

import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

export default function BulletPoint() {
  return (
    <Button variant="outline" size="icon">
      <List />
    </Button>
  );
}
