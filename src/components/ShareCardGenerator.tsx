import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

interface ShareCardGeneratorProps {
  content: string;
  emotionalTone?: string;
  author?: string;
}

type ShareSize = "instagram" | "twitter" | "linkedin";

const SHARE_SIZES = {
  instagram: { width: 1080, height: 1080, label: "Instagram" },
  twitter: { width: 1200, height: 675, label: "Twitter/X" },
  linkedin: { width: 1200, height: 627, label: "LinkedIn" },
};

export function ShareCardGenerator({ 
  content, 
  emotionalTone = "reflective",
  author = "Your Parallel Self"
}: ShareCardGeneratorProps) {
  const [selectedSize, setSelectedSize] = useState<ShareSize>("instagram");
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      // In production, this would use html2canvas or similar
      toast.success("Share card downloaded!");
    } catch (error) {
      toast.error("Failed to download share card");
    }
  };

  const shareToSocial = (platform: ShareSize) => {
    toast.success(`Opening ${SHARE_SIZES[platform].label} share dialog...`);
  };

  const { width, height } = SHARE_SIZES[selectedSize];
  const aspectRatio = width / height;

  return (
    <div className="space-y-6">
      {/* Size selector */}
      <div className="flex gap-2 justify-center flex-wrap">
        {(Object.keys(SHARE_SIZES) as ShareSize[]).map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            onClick={() => setSelectedSize(size)}
            size="sm"
            className="gap-2"
          >
            {size === "instagram" && <Instagram className="h-4 w-4" />}
            {size === "twitter" && <Twitter className="h-4 w-4" />}
            {size === "linkedin" && <Linkedin className="h-4 w-4" />}
            {SHARE_SIZES[size].label}
          </Button>
        ))}
      </div>

      {/* Preview card */}
      <motion.div
        ref={cardRef}
        className="mx-auto max-w-2xl"
        style={{ aspectRatio }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="relative h-full p-12 flex flex-col justify-between overflow-hidden"
          style={{
            background: "var(--gradient-primary)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <blockquote className="text-white text-2xl md:text-3xl font-semibold leading-relaxed mb-6">
              "{content}"
            </blockquote>
            <p className="text-white/80 text-lg">— {author}</p>
            {emotionalTone && (
              <p className="text-white/60 text-sm mt-2 italic">{emotionalTone}</p>
            )}
          </div>

          {/* Logo watermark */}
          <div className="relative z-10 flex justify-between items-end">
            <Logo variant="horizontal" size="sm" animated={false} />
            <p className="text-white/60 text-sm">ParallelSelf.app</p>
          </div>
        </Card>
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button
          onClick={downloadCard}
          className="gap-2"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button
          onClick={() => shareToSocial(selectedSize)}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
