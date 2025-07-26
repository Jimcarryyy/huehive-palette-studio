import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaletteCard } from "@/components/ui/palette-card";
import { Shuffle, Palette, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Utility functions for color generation
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
  const lightness = Math.floor(Math.random() * 30) + 40; // 40-70%
  return hslToHex(hue, saturation, lightness);
};

const generateHarmoniousPalette = (): string[] => {
  const baseHue = Math.floor(Math.random() * 360);
  const colors: string[] = [];
  
  // Generate complementary and analogous colors
  const hues = [
    baseHue,
    (baseHue + 30) % 360,
    (baseHue + 60) % 360,
    (baseHue + 120) % 360,
    (baseHue + 180) % 360
  ];
  
  hues.forEach(hue => {
    const saturation = Math.floor(Math.random() * 30) + 70;
    const lightness = Math.floor(Math.random() * 25) + 45;
    colors.push(hslToHex(hue, saturation, lightness));
  });
  
  return colors;
};

export const ColorPickerTool = () => {
  const [currentPalette, setCurrentPalette] = useState<string[]>(() => generateHarmoniousPalette());
  const [savedPalettes, setSavedPalettes] = useState<string[][]>([]);
  const { toast } = useToast();

  const generateNewPalette = useCallback(() => {
    setCurrentPalette(generateHarmoniousPalette());
  }, []);

  const generateRandomPalette = useCallback(() => {
    const colors = Array.from({ length: 5 }, () => generateRandomColor());
    setCurrentPalette(colors);
  }, []);

  const handleCopyPalette = useCallback(async () => {
    try {
      const paletteText = currentPalette.join(', ');
      await navigator.clipboard.writeText(paletteText);
      toast({
        title: "Palette Copied!",
        description: "Color palette copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy palette to clipboard",
        variant: "destructive",
      });
    }
  }, [currentPalette, toast]);

  const handleSavePalette = useCallback(() => {
    setSavedPalettes(prev => [...prev, currentPalette]);
    toast({
      title: "Palette Saved!",
      description: "Palette added to your collection",
    });
  }, [currentPalette, toast]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Main Color Generator */}
      <Card className="p-8 bg-gradient-subtle border-border/50 shadow-color">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Color Palette Generator
          </h2>
          <p className="text-muted-foreground">
            Generate beautiful, harmonious color palettes for your projects
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={generateNewPalette}
            size="lg"
            className="bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Palette className="w-5 h-5 mr-2" />
            Generate Harmony
          </Button>
          
          <Button
            onClick={generateRandomPalette}
            variant="outline"
            size="lg"
            className="bg-background/50 backdrop-blur-sm"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Random Colors
          </Button>
        </div>

        <PaletteCard
          colors={currentPalette}
          title="Current Palette"
          onCopy={handleCopyPalette}
          onShuffle={generateNewPalette}
          className="bg-card/80 border-primary/20"
        />

        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSavePalette}
            variant="secondary"
            className="bg-secondary/80"
          >
            Save Palette
          </Button>
        </div>
      </Card>

      {/* Saved Palettes */}
      {savedPalettes.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            Your Saved Palettes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPalettes.map((palette, index) => (
              <PaletteCard
                key={index}
                colors={palette}
                title={`Palette ${index + 1}`}
                onCopy={() => {
                  navigator.clipboard.writeText(palette.join(', '));
                  toast({
                    title: "Palette Copied!",
                    description: "Color palette copied to clipboard",
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};