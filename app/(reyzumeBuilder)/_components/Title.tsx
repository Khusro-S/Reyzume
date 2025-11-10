"use client";

// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useTitle } from "@/hooks/use-editable-title";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TitleProps {
  initialData: Doc<"reyzumes">;
}

export default function Title({ initialData }: TitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  // const [isEditing, setIsEditing] = useState(false);

  const {
    editingTitleId,
    editingTitleValue,
    // setEditing,
    updateValue,
    clearEditing,
  } = useTitle();

  const update = useMutation(api.reyzumes.updateReyzume);

  const isEditing = editingTitleId === initialData._id;
  // Determine what to display: if this document is being edited, use store value, otherwise use initialData
  const displayTitle =
    editingTitleId === initialData._id
      ? editingTitleValue
      : initialData.title || "Untitled";

  // Check if text is truncated
  useEffect(() => {
    if (textRef.current && !isEditing) {
      const isTrunc = textRef.current.scrollWidth > textRef.current.clientWidth;
      setIsTruncated(isTrunc);
    }
  }, [displayTitle, isEditing]);

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  // Debounce effect - waits 300ms after user stops typing
  useEffect(() => {
    if (editingTitleId !== initialData._id) return;

    const timer = setTimeout(() => {
      if (editingTitleValue !== initialData.title) {
        update({
          id: initialData._id,
          title: editingTitleValue || "Untitled",
        });
      }
    }, 100);

    // Cleanup: cancel the timer if user types again
    return () => {
      clearTimeout(timer);
    };
  }, [
    editingTitleValue,
    editingTitleId,
    initialData._id,
    initialData.title,
    update,
  ]);

  //   const enableInput = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     setEditing(initialData._id, initialData.title || "Untitled");
  //     setIsEditing(true);

  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //       inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
  //     }, 0);
  //   };

  const disableInput = () => {
    // setEditing(false);
    clearEditing();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      disableInput();
    }
  };
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div
      className="w-full font-medium text-foreground text-center truncate"
      onClick={handleClick}
    >
      {/* {!!initialData.icon && <p>{initialData.icon}</p>} */}
      {isEditing ? (
        <Input
          ref={inputRef}
          //   onClick={enableInput}
          onClick={handleClick}
          onBlur={() => {
            // Delay blur to allow click events to complete
            setTimeout(() => {
              disableInput();
            }, 150);
          }}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={displayTitle}
          className="h-7 px-2 focus-visible:ring-transparent w-full"
        />
      ) : (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <h3
                ref={textRef}
                className="font-medium text-foreground truncate w-full"
                // title=""
              >
                {displayTitle}
                {/* to prevent safari/browser default tooltip */}
                <div></div>
              </h3>
            </TooltipTrigger>
            {isTruncated && (
              <TooltipContent>
                <p className="max-w-[300px] w-full wrap-break-word">
                  {displayTitle}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

// Title.Skeleton = function TitleSkeleton() {
//   return <Skeleton className="h-7 w-20 rounded-md" />;
// };
