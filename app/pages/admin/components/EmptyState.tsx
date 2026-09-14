import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="p-12 flex flex-col items-center gap-3 text-center bg-secondary/5 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground/40" />
      </div>
      <div>
        <p className="font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground/70 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
