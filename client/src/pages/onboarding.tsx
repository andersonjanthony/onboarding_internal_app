import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, User } from 'lucide-react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import ClientSummary from '@/components/onboarding/ClientSummary';
import ProjectCalendar from '@/components/onboarding/ProjectCalendar';
import SecurityResources from '@/components/onboarding/SecurityResources';
import IntegrationStatus from '@/components/onboarding/IntegrationStatus';
import type { Client } from '@shared/schema';

export default function OnboardingPage() {
  const [currentUser] = useState({ name: "Taylor Morgan" });
  
  // Get the first client (in a real app, this would be based on authentication)
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const client = clients?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your onboarding dashboard...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No client data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">SecureForce</span>
            <div className="text-xs text-muted-foreground">Security & Compliance</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Welcome, <span className="font-medium text-foreground" data-testid="text-username">{currentUser.name}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {/* Hero Section */}
        <section className="py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Your Salesforce Security Journey
          </h1>
          <p className="text-muted-foreground mb-8">
            Let's get you set up with comprehensive security services—just a few steps to get started.
          </p>
        </section>

        {/* Onboarding Wizard */}
        <OnboardingWizard client={client} />

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ClientSummary client={client} />
          <ProjectCalendar clientId={client.id} />
        </section>

        {/* Security Resources */}
        <SecurityResources />

        {/* Integration Status */}
        <IntegrationStatus clientId={client.id} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 mt-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">SecureForce</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Comprehensive Salesforce security services and compliance solutions
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
