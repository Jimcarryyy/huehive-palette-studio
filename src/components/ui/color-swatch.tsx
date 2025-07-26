import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ColorSwatchProps {
  color: string;
  size?: "sm" | "md" | "lg";
  showHex?: boolean;
  copyable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ColorSwatch = ({ 
  color, 
  size = "md", 
  showHex = false, 
  copyable = false, 
  className,
  onClick 
}: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <div
        className={cn(
          "rounded-lg border-2 border-white shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
          sizeClasses[size],
          onClick && "hover:ring-2 hover:ring-primary hover:ring-offset-2"
        )}
        style={{ backgroundColor: color }}
        onClick={onClick}
      >
        {copyable && (
          <button
            onClick={handleCopy}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 rounded-lg"
          >
            {copied ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4 text-white" />
            )}
          </button>
        )}
      </div>
      {showHex && (
        <p className="text-xs text-muted-foreground mt-1 text-center font-mono">
          {color.toUpperCase()}
        </p>
      )}
    </div>
  );
};