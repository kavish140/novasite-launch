import { CheckSquare, Download, Trash2, X, CheckCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  selectedCount: number;
  onResolve?: () => void;
  onExport: () => void;
  onDelete?: () => void;
  onClear: () => void;
  showResolve?: boolean;
  showDelete?: boolean;
}

export default function BulkActionBar({
  selectedCount,
  onResolve,
  onExport,
  onDelete,
  onClear,
  showResolve = true,
  showDelete = false,
}: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/95 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span>{selectedCount} selected</span>
          </div>

          <div className="w-px h-4 bg-border/60 mx-0.5" />

          {showResolve && onResolve && (
            <Button
              size="sm"
              className="h-7 px-3 text-xs gap-1.5"
              onClick={onResolve}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Resolve All
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs gap-1.5 border-border/40"
            onClick={onExport}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>

          {showDelete && onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-3 text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          )}

          <div className="w-px h-4 bg-border/60 mx-0.5" />

          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
