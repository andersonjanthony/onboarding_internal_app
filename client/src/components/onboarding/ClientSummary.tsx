import { Building, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Client } from '@shared/schema';

interface ClientSummaryProps {
  client: Client;
}

export default function ClientSummary({ client }: ClientSummaryProps) {
  const getStatusInfo = () => {
    if (client.kickoffScheduled) {
      return { text: "Kickoff Scheduled", color: "bg-primary/10 text-primary" };
    } else if (client.systemDetailsComplete) {
      return { text: "System Details Complete", color: "bg-secondary/10 text-secondary" };
    } else if (client.contractSigned) {
      return { text: "Contract Signed", color: "bg-accent/10 text-accent" };
    } else {
      return { text: "Awaiting Contract", color: "bg-accent/10 text-accent" };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground" data-testid="text-client-name">
            {client.name}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-client-industry">
            {client.industry}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Primary Contact</span>
          <span className="text-sm font-medium text-card-foreground" data-testid="text-primary-contact">
            {client.primaryContactName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Email</span>
          <span className="text-sm font-medium text-card-foreground" data-testid="text-primary-email">
            {client.primaryContactEmail}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Service Package</span>
          <span className="text-sm font-medium text-card-foreground" data-testid="text-service-package">
            {client.servicePackage}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-muted-foreground">Project Status</span>
          <Badge className={`text-xs font-medium ${status.color}`} data-testid="badge-project-status">
            <Clock className="h-3 w-3 mr-1" />
            {status.text}
          </Badge>
        </div>
      </div>
    </div>
  );
}
