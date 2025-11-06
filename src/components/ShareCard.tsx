import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Download } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface ShareCardProps {
  quote: string;
  author?: string;
}

export const ShareCard = ({ quote, author = "Your Alternate Self" }: ShareCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareImage = async () => {
    setIsGenerating(true);
    try {
      // Create a canvas for the share card
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Canvas not supported");

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#E5DEFF");
      gradient.addColorStop(0.5, "#A5F3FC");
      gradient.addColorStop(1, "#FED7E2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Quote text
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 48px Inter, sans-serif";
      ctx.textAlign = "center";
      
      // Word wrap the quote
      const words = quote.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      
      words.forEach(word => {
        const testLine = currentLine + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 200 && currentLine !== "") {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine.trim());

      // Draw quote lines
      const lineHeight = 60;
      const startY = (canvas.height - (lines.length * lineHeight)) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, startY + (i * lineHeight));
      });

      // Author
      ctx.font = "italic 32px Inter, sans-serif";
      ctx.fillStyle = "#6B7280";
      ctx.fillText(`— ${author}`, canvas.width / 2, startY + (lines.length * lineHeight) + 60);

      // Watermark
      ctx.font = "24px Inter, sans-serif";
      ctx.fillStyle = "#9CA3AF";
      ctx.fillText("Lokah", canvas.width / 2, canvas.height - 40);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to generate image");
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
  a.download = "lokah-alternate-self-wisdom.png";
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success("Share card downloaded!");
      }, "image/png");
      
    } catch (error) {
      console.error("Error generating share card:", error);
      toast.error("Failed to generate share card");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${quote}"\n— ${author}\n\nLokah`);
    toast.success("Quote copied to clipboard!");
  };

  return (
    <Card className="p-6 glass-card">
      <blockquote className="text-lg italic mb-4 text-foreground/90">
        "{quote}"
      </blockquote>
      <p className="text-sm text-muted-foreground mb-4">— {author}</p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Copy Quote
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={generateShareImage}
          disabled={isGenerating}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Download Card"}
        </Button>
      </div>
    </Card>
  );
};
