import { MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuickActionsProps {
  name: string;
  phone?: string | null;
  email?: string | null;
}

export default function QuickActions({ name, phone, email }: QuickActionsProps) {
  const digits = phone?.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi ${name}, I'm reaching out from SiteNova regarding your inquiry. When would be a good time to connect?`
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
        {digits && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10" asChild>
                  <a href={`https://wa.me/91${digits}?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">WhatsApp</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-sky-500 hover:text-sky-400 hover:bg-sky-500/10" asChild>
                  <a href={`tel:${digits}`}>
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Call</TooltipContent>
            </Tooltip>
          </>
        )}

        {email && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-primary hover:bg-primary/10" asChild>
                <a href={`mailto:${email}`}>
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Email</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
