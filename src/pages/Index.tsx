import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorPickerTool } from "@/components/color-picker-tool";
import { Palette, Sparkles, Download, Star, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const scrollToColorPicker = () => {
    document.getElementById('color-picker')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Color palette studio" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Create Stunning
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Color Palettes</span>
              <br />in Seconds
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Generate, customize, and save beautiful color palettes for your design projects. 
              Perfect for designers, developers, and creative professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={scrollToColorPicker}
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-xl transition-all duration-300"
              >
                <Palette className="w-6 h-6 mr-2" />
                Start Picking Colors
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-background/50 backdrop-blur-sm border-primary/20"
              >
                <Download className="w-6 h-6 mr-2" />
                View Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need for Perfect Colors
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional-grade tools for color palette creation and management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-color transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Smart Generation
            </h3>
            <p className="text-muted-foreground">
              AI-powered algorithms create harmonious color combinations that work perfectly together
            </p>
          </Card>

          <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-color transition-all duration-300">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Instant Copy
            </h3>
            <p className="text-muted-foreground">
              One-click copying of HEX codes, RGB values, and complete palette collections
            </p>
          </Card>

          <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-color transition-all duration-300">
            <div className="w-16 h-16 bg-primary-glow rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Save & Export
            </h3>
            <p className="text-muted-foreground">
              Save your favorite palettes and export them in multiple formats for any project
            </p>
          </Card>
        </div>
      </section>

      {/* Color Picker Tool */}
      <section id="color-picker" className="py-20 bg-background/50">
        <ColorPickerTool />
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 text-center">
        <Card className="p-12 bg-gradient-primary/5 border-primary/20">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to Create Amazing Palettes?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of designers and developers using HueHive for their color needs
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Palettes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Color Tools</div>
            </div>
          </div>

          <Button
            onClick={scrollToColorPicker}
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Palette className="w-6 h-6 mr-2" />
            Start Creating Now
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Index;
