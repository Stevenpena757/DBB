import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Sparkles } from "lucide-react";

const STORAGE_KEY = "dbb_welcome_modal_shown";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hasSeenModal = localStorage.getItem(STORAGE_KEY);
    
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const handleExplore = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
    setLocation("/my-beauty-book");
  };

  const handleBusiness = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
    setLocation("/for-professionals");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden"
        data-testid="modal-welcome"
      >
        <div className="bg-gradient-to-br from-dbb-surface to-background p-8 md:p-10">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto w-20 h-20 bg-dbb-forest rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            
            <DialogTitle 
              className="text-3xl md:text-4xl font-extrabold text-navy"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Welcome to DallasBeautyBook
            </DialogTitle>
            
            <DialogDescription 
              className="text-lg text-muted-foreground leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              A DFW hub for beauty, wellness, and aesthetics. Choose how you'd like to start.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-4">
            <div className="space-y-3">
              <Button
                size="lg"
                onClick={handleExplore}
                className="w-full rounded-2xl font-bold bg-dbb-forest hover:bg-dbb-forest/90 text-white shadow-md h-16"
                style={{ fontFamily: 'var(--font-ui)' }}
                data-testid="button-modal-explore"
              >
                <Search className="h-5 w-5 mr-2" />
                I'm looking for beauty services
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleBusiness}
                className="w-full rounded-2xl font-semibold border-2 h-16"
                style={{ fontFamily: 'var(--font-ui)' }}
                data-testid="button-modal-business"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                I run or manage a beauty business
              </Button>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
                data-testid="button-modal-close"
              >
                Just browse for now
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
