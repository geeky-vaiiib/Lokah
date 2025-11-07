import { useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ShareCardProps {
  quote: string;
  author?: string;
}

export const ShareCard = ({ quote, author = "Your Alternate Self" }: ShareCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#E5DEFF");
      gradient.addColorStop(0.5, "#A5F3FC");
      gradient.addColorStop(1, "#FED7E2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 48px Inter, sans-serif";
      ctx.textAlign = "center";
      const words = quote.split(" ");
      const lines: string[] = [];
      let current = "";
      words.forEach((w) => {
        const test = current + w + " ";
        if (ctx.measureText(test).width > canvas.width - 200 && current !== "") {
          lines.push(current.trim());
          current = w + " ";
        } else {
          current = test;
        }
      });
      lines.push(current.trim());
      const lineHeight = 60;
      const startY = (canvas.height - lines.length * lineHeight) / 2;
      lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, startY + i * lineHeight));

      ctx.font = "italic 32px Inter, sans-serif";
      ctx.fillStyle = "#6B7280";
      ctx.fillText(`— ${author}`, canvas.width / 2, startY + lines.length * lineHeight + 60);

      ctx.font = "24px Inter, sans-serif";
      ctx.fillStyle = "#374151";
      ctx.fillText("LOKAH — Many Worlds, One You", canvas.width / 2, canvas.height - 40);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to generate image");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lokah-share-card.png";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Share card downloaded");
      }, "image/png");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate share card");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${quote}"\n— ${author}\nLokah`);
    toast.success("Quote copied");
  };

  return (
    <Card className="p-6 glass-card">
      <blockquote className="text-lg italic mb-4 text-foreground/90">“{quote}”</blockquote>
      <p className="text-sm text-muted-foreground mb-4">— {author}</p>
      <div className="flex gap-3">
  <GlassButton
          variant="secondary"
          onClick={copyToClipboard}
          label="Copy Quote"
          className="flex-1 gap-2"
        />
  <GlassButton
          onClick={generateShareImage}
          disabled={isGenerating}
          label={isGenerating ? "Generating..." : "Download Card"}
          className="flex-1 gap-2"
        />
      </div>
    </Card>
  );
};

export default ShareCard;
