import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Calendar, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Client, UpdateClient } from '@shared/schema';

interface OnboardingWizardProps {
  client: Client;
}

export default function OnboardingWizard({ client }: OnboardingWizardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [contractData, setContractData] = useState({
    servicePackage: client.servicePackage || 'Security Assessment Pro',
    zohoContractId: client.zohoContractId || '',
    zohoMeetingUrl: client.zohoMeetingUrl || '',
  });

  const [systemData, setSystemData] = useState({
    salesforceEdition: client.salesforceEdition || 'Professional',
    numberOfUsers: client.numberOfUsers || '',
    complianceRequirements: client.complianceRequirements || ['HIPAA', 'SOC 2', 'GDPR'],
  });

  const updateClientMutation = useMutation({
    mutationFn: async (updates: UpdateClient) => {
      const response = await apiRequest('PATCH', `/api/clients/${client.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
    },
  });

  const handleContractSigning = async () => {
    try {
      await updateClientMutation.mutateAsync({
        ...contractData,
        contractSigned: true,
        currentStep: '2',
      });
      
      toast({
        title: "Contract Signed Successfully",
        description: "You can now proceed to the system details step.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSystemDetailsSubmit = async () => {
    try {
      await updateClientMutation.mutateAsync({
        ...systemData,
        systemDetailsComplete: true,
        currentStep: '3',
      });
      
      toast({
        title: "System Details Saved",
        description: "You can now schedule your kickoff meeting.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKickoffScheduling = async () => {
    try {
      await updateClientMutation.mutateAsync({
        kickoffScheduled: true,
        currentStep: '4',
      });
      
      toast({
        title: "Kickoff Meeting Scheduled",
        description: "You'll receive a calendar invitation shortly.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentStep = parseInt(client.currentStep);

  const steps = [
    { id: 1, name: "Service Contract", completed: client.contractSigned },
    { id: 2, name: "System Details", completed: client.systemDetailsComplete },
    { id: 3, name: "Schedule Kickoff", completed: client.kickoffScheduled },
    { id: 4, name: "Resources Access", completed: client.resourcesAccessed },
  ];

  return (
    <div className="mb-12">
      {/* Stepper */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-8 text-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              {index > 0 && <div className="h-px w-12 bg-border mr-6"></div>}
              <div className={`h-2.5 w-2.5 rounded-full ${
                step.completed ? 'bg-primary' : 
                currentStep === step.id ? 'bg-primary' : 'bg-border'
              }`}></div>
              <span className={`${
                step.completed || currentStep === step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Service Contract */}
        <div className={`bg-card border border-border rounded-xl p-6 shadow-sm ${
          currentStep !== 1 && client.contractSigned ? 'opacity-60' : ''
        }`}>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                client.contractSigned ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'
              }`}>
                {client.contractSigned ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Service Contract</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Confirm your selected security package and sign the agreement.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="service-package" className="text-sm font-medium text-card-foreground mb-2">
                Security Package
              </Label>
              <Select 
                value={contractData.servicePackage} 
                onValueChange={(value) => setContractData(prev => ({ ...prev, servicePackage: value }))}
                disabled={client.contractSigned}
              >
                <SelectTrigger data-testid="select-service-package">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Security Assessment Pro">Security Assessment Pro</SelectItem>
                  <SelectItem value="Monitoring Retainer">Monitoring Retainer</SelectItem>
                  <SelectItem value="Backup & DR Testing">Backup & DR Testing</SelectItem>
                  <SelectItem value="Custom Security Audit">Custom Security Audit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Input
                placeholder="Zoho Contract ID (optional)"
                value={contractData.zohoContractId}
                onChange={(e) => setContractData(prev => ({ ...prev, zohoContractId: e.target.value }))}
                disabled={client.contractSigned}
                data-testid="input-zoho-contract-id"
              />
              <Input
                type="url"
                placeholder="Zoho Meeting URL (optional)"
                value={contractData.zohoMeetingUrl}
                onChange={(e) => setContractData(prev => ({ ...prev, zohoMeetingUrl: e.target.value }))}
                disabled={client.contractSigned}
                data-testid="input-zoho-meeting-url"
              />
            </div>
          </div>
          
          <div className="mt-6">
            {client.contractSigned ? (
              <Button className="w-full" disabled data-testid="button-contract-signed">
                <Check className="h-4 w-4 mr-2" />
                Contract Signed
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleContractSigning}
                disabled={updateClientMutation.isPending}
                data-testid="button-sign-agreement"
              >
                <Check className="h-4 w-4 mr-2" />
                {updateClientMutation.isPending ? 'Signing...' : 'Sign Agreement'}
              </Button>
            )}
          </div>
        </div>

        {/* Step 2: System Information */}
        <div className={`bg-card border border-border rounded-xl p-6 shadow-sm ${
          !client.contractSigned ? 'opacity-60' : ''
        }`}>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                client.systemDetailsComplete ? 'bg-primary text-primary-foreground' :
                client.contractSigned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {client.systemDetailsComplete ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">System Information</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Tell us about your Salesforce environment and requirements.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-2">
                  Salesforce Edition
                </Label>
                <Select 
                  value={systemData.salesforceEdition} 
                  onValueChange={(value) => setSystemData(prev => ({ ...prev, salesforceEdition: value }))}
                  disabled={!client.contractSigned || client.systemDetailsComplete}
                >
                  <SelectTrigger data-testid="select-salesforce-edition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Unlimited">Unlimited</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-2">
                  Number of Users
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 150"
                  value={systemData.numberOfUsers}
                  onChange={(e) => setSystemData(prev => ({ ...prev, numberOfUsers: e.target.value }))}
                  disabled={!client.contractSigned || client.systemDetailsComplete}
                  data-testid="input-number-of-users"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-card-foreground mb-2">
                Compliance Requirements
              </Label>
              <div className="flex flex-wrap gap-2">
                {systemData.complianceRequirements.map((req) => (
                  <Badge key={req} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            {client.systemDetailsComplete ? (
              <Button className="w-full" disabled data-testid="button-system-details-complete">
                System Details Complete
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleSystemDetailsSubmit}
                disabled={!client.contractSigned || updateClientMutation.isPending}
                data-testid="button-complete-system-survey"
              >
                {updateClientMutation.isPending ? 'Saving...' : 'Complete System Survey →'}
              </Button>
            )}
          </div>
        </div>

        {/* Step 3: Schedule Kickoff */}
        <div className={`bg-card border border-border rounded-xl p-6 shadow-sm ${
          !client.systemDetailsComplete ? 'opacity-60' : ''
        }`}>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                client.kickoffScheduled ? 'bg-primary text-primary-foreground' :
                client.systemDetailsComplete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {client.kickoffScheduled ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Schedule Kickoff</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Book your project kickoff meeting with our security team.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-card-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {client.systemDetailsComplete 
                    ? "Ready to schedule your kickoff meeting" 
                    : "Meeting will be scheduled after system details"
                  }
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium text-card-foreground">Typical kickoff agenda:</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Scope and timeline review</li>
                <li>• Technical access requirements</li>
                <li>• Communication protocols</li>
                <li>• Risk assessment planning</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            {client.kickoffScheduled ? (
              <Button className="w-full" disabled data-testid="button-meeting-scheduled">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Meeting Scheduled
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleKickoffScheduling}
                disabled={!client.systemDetailsComplete || updateClientMutation.isPending}
                data-testid="button-schedule-meeting"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                {updateClientMutation.isPending ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
