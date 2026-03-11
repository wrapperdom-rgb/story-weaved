import { X, Copy, Download, Sparkles, Camera, Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/store/galleryStore";

const PromptModal = ({
  item,
  onClose,
  hasPremium,
  isLoggedIn,
}: {
  item: GalleryItem;
  onClose: () => void;
  hasPremium: boolean;
  isLoggedIn: boolean;
}) => {
  const navigate = useNavigate();
  const canAccess = item.isFree || hasPremium;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = item.src;
    link.download = `mvstr-${item.id}.jpg`;
    link.click();
    toast.success("Image downloading...");
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 bg-background text-foreground border border-border hover:bg-accent transition-colors"
        >
          <X size={16} />
        </button>

        <img src={item.src} alt="Style" className="w-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

        <div className="p-6 space-y-4">
          {canAccess ? (
            <>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-[10px] font-bold tracking-wider bg-primary text-primary-foreground">
                  {item.isFree ? "FREE PROMPT" : "PREMIUM PROMPT"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-foreground font-mono">{item.prompt}</p>
              <div className="flex gap-2">
                <button onClick={handleCopyPrompt} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  <Copy size={14} /> COPY PROMPT
                </button>
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-foreground hover:bg-accent transition-colors">
                  <Download size={14} /> DOWNLOAD
                </button>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">HOW TO USE</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Download size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] leading-relaxed text-muted-foreground">Download the reference image above</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Copy size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] leading-relaxed text-muted-foreground">Copy the prompt to your clipboard</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] leading-relaxed text-muted-foreground">Open <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="underline text-foreground hover:opacity-80">Google Gemini</a> or any AI image tool</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Camera size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] leading-relaxed text-muted-foreground">Upload your face photo + the reference image, paste the prompt & generate</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <Lock size={24} className="mx-auto text-muted-foreground" />
              <p className="text-xs font-bold tracking-wider text-muted-foreground">
                {isLoggedIn ? "GET ACCESS TO UNLOCK PREMIUM PROMPTS" : "SIGN UP TO UNLOCK THIS PROMPT"}
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (isLoggedIn) {
                    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/sign-up");
                  }
                }}
                className="w-full px-4 py-3 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {isLoggedIn ? "GET ACCESS — $1" : "SIGN UP"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PromptModal;
