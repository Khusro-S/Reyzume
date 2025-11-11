"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function Hyperlink() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const handleInsertLink = () => {
    // TODO: Connect to editor to insert hyperlink
    console.log("Inserting link:", { text, url });
    setIsOpen(false);
    setUrl("");
    setText("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-accent"
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Insert Hyperlink</h4>
            <p className="text-sm text-muted-foreground">
              Add a link to your resume.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="text" className="text-xs">
                Display Text
              </Label>
              <Input
                id="text"
                placeholder="LinkedIn Profile"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url" className="text-xs">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-8"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              onClick={handleInsertLink}
              disabled={!url || !text}
            >
              Insert
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
