import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaletteCard } from "@/components/ui/palette-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shuffle, Palette, Sparkles, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Utility functions for color generation (same as before)
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
  const saturation = Math.floor(Math.random() * 40) + 60;
  const lightness = Math.floor(Math.random() * 30) + 40;
  return hslToHex(hue, saturation, lightness);
};

const generateHarmoniousPalette = (): string[] => {
  const baseHue = Math.floor(Math.random() * 360);
  const colors: string[] = [];
  
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

interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  created_at: string;
}

export const ColorPickerTool = () => {
  const [currentPalette, setCurrentPalette] = useState<string[]>(() => generateHarmoniousPalette());
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [loading, setLoading] = useState(false);
  const [savePaletteName, setSavePaletteName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch saved palettes when user is authenticated
  useEffect(() => {
    if (user) {
      fetchSavedPalettes();
    } else {
      setSavedPalettes([]);
    }
  }, [user]);

  const fetchSavedPalettes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('color_palettes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedPalettes(data || []);
    } catch (error) {
      console.error('Error fetching palettes:', error);
      toast({
        title: "Error",
        description: "Failed to load saved palettes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSavePalette = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save palettes",
        variant: "destructive",
      });
      return;
    }

    if (!savePaletteName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your palette",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('color_palettes')
        .insert({
          name: savePaletteName.trim(),
          colors: currentPalette,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Palette Saved!",
        description: "Your palette has been saved to your collection",
      });

      setSavePaletteName("");
      setSaveDialogOpen(false);
      fetchSavedPalettes();
    } catch (error) {
      console.error('Error saving palette:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save palette. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePalette = async (paletteId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('color_palettes')
        .delete()
        .eq('id', paletteId);

      if (error) throw error;

      toast({
        title: "Palette Deleted",
        description: "Palette removed from your collection",
      });

      fetchSavedPalettes();
    } catch (error) {
      console.error('Error deleting palette:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete palette. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySavedPalette = useCallback(async (colors: string[]) => {
    try {
      const paletteText = colors.join(', ');
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
  }, [toast]);

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
          {user ? (
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-secondary/80"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Palette
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Palette</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="palette-name">Palette Name</Label>
                    <Input
                      id="palette-name"
                      placeholder="Enter a name for your palette"
                      value={savePaletteName}
                      onChange={(e) => setSavePaletteName(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSavePalette}
                      disabled={loading}
                      className="bg-gradient-primary text-primary-foreground flex-1"
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSaveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <p className="text-muted-foreground">
              Sign in to save your palettes
            </p>
          )}
        </div>
      </Card>

      {/* Saved Palettes */}
      {user && savedPalettes.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            Your Saved Palettes ({savedPalettes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPalettes.map((palette) => (
              <div key={palette.id} className="relative">
                <PaletteCard
                  colors={palette.colors}
                  title={palette.name}
                  onCopy={() => handleCopySavedPalette(palette.colors)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePalette(palette.id)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && savedPalettes.length === 0 && !loading && (
        <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Saved Palettes Yet
          </h3>
          <p className="text-muted-foreground">
            Create and save your first color palette to get started!
          </p>
        </Card>
      )}
    </div>
  );
};