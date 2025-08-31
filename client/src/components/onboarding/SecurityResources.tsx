import { BookOpen, Wrench, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SecurityResources() {
  const { toast } = useToast();

  const handleAccessPlaybooks = () => {
    toast({
      title: "Security Playbooks",
      description: "Accessing comprehensive security playbook library...",
    });
  };

  const handleDownloadTools = () => {
    toast({
      title: "Security Tools",
      description: "Preparing security tools package for download...",
    });
  };

  const handleStartTraining = () => {
    toast({
      title: "Training Materials",
      description: "Launching interactive security training portal...",
    });
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-foreground mb-2">Your Security Resources</h2>
        <p className="text-muted-foreground">
          Access comprehensive guides, tools, and training materials for your security journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Playbooks */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground mb-2">Security Playbooks</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Step-by-step guides covering incident response, compliance frameworks, and security best practices tailored for Salesforce environments.
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-medium text-primary hover:underline flex items-center gap-1"
                onClick={handleAccessPlaybooks}
                data-testid="button-access-playbooks"
              >
                Access Playbooks
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Security Tools */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Wrench className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground mb-2">Security Tools</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Custom scripts, monitoring utilities, and assessment tools designed to enhance your Salesforce security posture and automate compliance tasks.
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-medium text-secondary hover:underline flex items-center gap-1"
                onClick={handleDownloadTools}
                data-testid="button-download-tools"
              >
                Download Tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Training Materials */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground mb-2">Training Materials</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive onboarding content, video tutorials, and interactive workshops to educate your team on security protocols and procedures.
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-medium text-accent hover:underline flex items-center gap-1"
                onClick={handleStartTraining}
                data-testid="button-start-training"
              >
                Start Training
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
