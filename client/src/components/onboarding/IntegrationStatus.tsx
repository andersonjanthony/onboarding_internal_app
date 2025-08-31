import { useQuery } from '@tanstack/react-query';
import { Zap, MessageSquare, Calendar, Workflow } from 'lucide-react';
import type { IntegrationStatus } from '@shared/schema';

interface IntegrationStatusProps {
  clientId: string;
}

export default function IntegrationStatus({ clientId }: IntegrationStatusProps) {
  const { data: integrationStatus, isLoading } = useQuery<IntegrationStatus>({
    queryKey: ['/api/clients', clientId, 'integrations'],
  });

  if (isLoading) {
    return (
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!integrationStatus) {
    return (
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="text-center text-muted-foreground">
          Integration status not available
        </div>
      </section>
    );
  }

  const integrations = [
    {
      name: "Slack Notifications",
      status: integrationStatus.slackConnected ? "Connected" : "Disconnected",
      icon: MessageSquare,
      bgColor: "bg-[#4A154B]",
      connected: integrationStatus.slackConnected,
    },
    {
      name: "Zoho Meetings",
      status: integrationStatus.zohoConnected ? "Ready" : "Not Ready",
      icon: Calendar,
      bgColor: "bg-[#C9302C]",
      connected: integrationStatus.zohoConnected,
    },
    {
      name: "n8n Automation",
      status: integrationStatus.n8nConnected ? "Configured" : "Not Configured",
      icon: Workflow,
      bgColor: "bg-[#EA4B71]",
      connected: integrationStatus.n8nConnected,
    },
  ];

  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
          <Zap className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground">Integration Status</h3>
          <p className="text-sm text-muted-foreground">Connected services and automation workflows</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div key={integration.name} className="flex items-center gap-3 p-3 rounded-lg border border-border">
            <div className={`h-8 w-8 rounded ${integration.bgColor} flex items-center justify-center`}>
              <integration.icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-card-foreground" data-testid={`text-integration-${integration.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {integration.name}
              </div>
              <div className="text-xs text-muted-foreground" data-testid={`status-integration-${integration.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {integration.status}
              </div>
            </div>
            <div className="ml-auto">
              <div className={`h-2 w-2 rounded-full ${
                integration.connected ? 'bg-green-500' : 'bg-red-500'
              }`} data-testid={`indicator-integration-${integration.name.toLowerCase().replace(/\s+/g, '-')}`}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
