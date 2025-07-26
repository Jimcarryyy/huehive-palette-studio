import { Card } from "@/components/ui/card";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { Button } from "@/components/ui/button";
import { Copy, Download, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaletteCardProps {
  colors: string[];
  title?: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onShuffle?: () => void;
  className?: string;
}

export const PaletteCard = ({ 
  colors, 
  title, 
  onCopy, 
  onDownload, 
  onShuffle,
  className 
}: PaletteCardProps) => {
  return (
    <Card className={cn("p-6 bg-card/50 backdrop-blur-sm border-border/50", className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      )}
      
      <div className="flex gap-3 mb-4 justify-center">
        {colors.map((color, index) => (
          <ColorSwatch
            key={index}
            color={color}
            size="lg"
            showHex
            copyable
          />
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        {onShuffle && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShuffle}
            className="bg-background/50 backdrop-blur-sm"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
        )}
        
        {onCopy && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="bg-background/50 backdrop-blur-sm"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
        )}
        
        {onDownload && (
          <Button
            size="sm"
            onClick={onDownload}
            className="bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </div>
    </Card>
  );
};