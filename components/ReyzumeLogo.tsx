import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ReyzumeLogoProps = {
  size?: number;
  imageClassName?: string;
  textClassName?: string;
  priority?: boolean;
  variant?: "navbar" | "footer";
};

export default function ReyzumeLogo({
  size = 24,
  imageClassName,
  textClassName,
  priority = false,
  variant = "navbar",
}: ReyzumeLogoProps) {
  return (
    <div className="flex justify-center items-center gap-1">
      <Link
        href="/"
        aria-label="Reyzume"
        className={cn(
          "inline-flex justify-center items-center gap-0.5",
          "transition-transform duration-150 ease-out",
          "hover:cursor-pointer active:scale-95",
          "text-base md:text-lg font-semibold",
        )}
      >
        <Image
          src="/ReyzumeLogo.png"
          alt="Reyzume logo"
          width={size}
          height={size}
          priority={priority}
          className={cn("shrink-0", imageClassName)}
        />
        <span
          className={cn(
            "text-xl font-bold leading-none tracking-tight text-primary",
            textClassName,
          )}
        >
          eyzume
        </span>
      </Link>
      {variant == "footer" && (
        <span className="text-xs text-[#6B7280] pt-1">
          © {new Date().getFullYear()}
        </span>
      )}
    </div>
  );
}
