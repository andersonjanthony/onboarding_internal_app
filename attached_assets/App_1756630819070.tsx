import React, { useMemo, useState } from 'react';

/** ---------- ENV / INTEGRATIONS ---------- **/
const SLACK_WEBHOOK = import.meta.env.VITE_SLACK_WEBHOOK || '';
const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK || '';

/** fire-and-forget helpers */
async function postToSlack(text: string) {
  if (!SLACK_WEBHOOK) return;
  try {
    await fetch(SLACK_WEBHOOK, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ text }) 
    });
  } catch (error) {
    console.log('Slack webhook not configured or failed');
  }
}

async function fireN8nEvent(evt: { name: string; client: string; payload?: any }) {
  if (!N8N_WEBHOOK) return;
  try {
    await fetch(N8N_WEBHOOK, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(evt) 
    });
  } catch (error) {
    console.log('N8N webhook not configured or failed');
  }
}

/** pretend persistence (swap for your API) */
function saveZohoLinks(clientId: string, meetingUrl?: string, contractId?: string) {
  const k = `client-${clientId}-zoho`;
  localStorage.setItem(k, JSON.stringify({ meetingUrl, contractId, savedAt: new Date().toISOString() }));
}

/** ---------- TYPES ---------- **/
type Client = {
  id: string;
  name: string;
  primaryContact: { name: string; email: string };
  edition?: 'Professional'|'Enterprise'|'Unlimited'|'Other';
  users?: number;
  integrations?: string[];
  compliance?: string[];
  zohoMeetingUrl?: string;
  zohoContractId?: string;
};

type Milestone = { 
  id: string; 
  date: string; 
  title: string; 
  type: 'Kickoff'|'Review'|'Delivery'|'Custom'; 
  status: 'Planned'|'Done' 
};

/** ---------- STYLES (Tailwind classes) ---------- **/
const card = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';
const btn = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ' +
            'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed';
const btnGhost = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ' +
                 'border border-slate-300 text-slate-700 hover:bg-slate-50';

/** ---------- MOCK DATA ---------- **/
const sampleClient: Client = {
  id: 'cs-001',
  name: 'Acme Health',
  primaryContact: { name: 'Taylor Morgan', email: 'taylor@acmehealth.com' }
};

const januaryMilestones: Milestone[] = [
  { id:'m1', date:'2025-01-15', title:'Kickoff',  type:'Kickoff',  status:'Planned' },
  { id:'m2', date:'2025-01-22', title:'Review',   type:'Review',   status:'Planned' },
  { id:'m3', date:'2025-01-29', title:'Delivery', type:'Delivery', status:'Planned' },
];

/** ---------- CALENDAR UTIL ---------- **/
function getMonthGrid(year: number, monthIdx0: number) {
  const first = new Date(year, monthIdx0, 1);
  const startIdx = (first.getDay() + 6) % 7; // make Monday=0
  const daysInMonth = new Date(year, monthIdx0+1, 0).getDate();
  const cells: { date?: string; label: number|null }[] = [];
  // leading blanks
  for (let i=0; i<startIdx; i++) cells.push({ label: null });
  for (let d=1; d<=daysInMonth; d++) {
    const date = new Date(year, monthIdx0, d);
    const iso = date.toISOString().slice(0,10);
    cells.push({ date: iso, label: d });
  }
  // trailing blanks to complete rows
  while (cells.length % 7 !== 0) cells.push({ label: null });
  return cells;
}

/** ---------- COMPONENTS ---------- **/
function Stepper({ step }: { step: 1|2|3 }) {
  const base = 'flex items-center gap-2 text-sm';
  const dot = (n: number) => n <= step ? 'h-2.5 w-2.5 rounded-full bg-slate-900' : 'h-2.5 w-2.5 rounded-full bg-slate-300';
  return (
    <div className="flex items-center gap-6 text-slate-600 mb-6">
      <div className={base}><span className={dot(1)} /> Service Selected</div>
      <div className={base}><span className={dot(2)} /> System Details</div>
      <div className={base}><span className={dot(3)} /> Schedule Meeting</div>
      <div className={base}><span className={dot(3)} /> Resources Access</div>
    </div>
  );
}

function WizardCard({
  title, desc, footer, children
}: { title: string; desc: string; footer?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={card}>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
      <div className="space-y-3">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

function Resources() {
  const Item = ({title, desc, cta}:{title:string; desc:string; cta:string}) => (
    <div className={card}>
      <div className="flex items-start gap-3">
        <div className="mt-1 h-8 w-8 rounded-xl bg-slate-100" />
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-sm text-slate-600">{desc}</div>
          <button className="mt-3 text-sm font-medium text-slate-900 hover:underline">{cta} →</button>
        </div>
      </div>
    </div>
  );
  return (
    <div className="mt-10">
      <h2 className="text-center text-lg font-semibold text-slate-900">Your Security Resources</h2>
      <p className="text-center text-sm text-slate-600 mb-6">Access guides, tools, and training for your service.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Item title="Security Playbooks" desc="Step-by-step guides for best practices." cta="Access Playbooks" />
        <Item title="Security Tools" desc="Scripts & utilities for monitoring and assessment." cta="Download Tools" />
        <Item title="Training Materials" desc="Onboarding content for your team." cta="Start Training" />
      </div>
    </div>
  );
}

function Calendar({ year=2025, monthIdx0=0, milestones }:{year?:number; monthIdx0?:number; milestones:Milestone[]}) {
  const cells = useMemo(()=>getMonthGrid(year, monthIdx0),[year,monthIdx0]);
  const byDate = useMemo(()=>milestones.reduce<Record<string,Milestone[]>>((a,m)=>{
    (a[m.date] ||= []).push(m); return a;
  },{}),[milestones]);

  const label = new Date(year, monthIdx0, 1).toLocaleString('en',{month:'long', year:'numeric'});
  const header = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className={card}>
      <div className="text-center">
        <div className="text-sm text-slate-700">Your Project Calendar</div>
        <div className="text-xs text-slate-500 -mt-0.5">Track meetings, milestones, and deliverables</div>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-4 py-2 text-sm font-medium">
          <span>{label}</span>
        </div>
        <div className="grid grid-cols-7 border-t border-slate-200 text-center text-xs font-medium text-slate-500">
          {header.map(h=><div key={h} className="py-2">{h}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {cells.map((c,idx)=>{
            const items = c.date ? byDate[c.date] : undefined;
            return (
              <div key={idx} className="min-h-[70px] bg-white p-1">
                <div className="text-[11px] text-slate-500">{c.label ?? ''}</div>
                {items?.map(m=>(
                  <div key={m.id} className={
                    'mt-1 w-full truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium ' +
                    (m.type==='Kickoff' ? 'bg-blue-100 text-blue-800' :
                     m.type==='Review'  ? 'bg-amber-100 text-amber-800' :
                     m.type==='Delivery'? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700')
                  }>
                    {m.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** ---------- MAIN ---------- **/
export default function App() {
  const [client, setClient] = useState<Client>(sampleClient);
  const [step, setStep] = useState<1|2|3>(1);
  const [milestones, setMilestones] = useState<Milestone[]>(januaryMilestones);

  /** actions */
  async function markContractSigned() {
    saveZohoLinks(client.id, client.zohoMeetingUrl, client.zohoContractId);
    await postToSlack(`🧾 Contract signed for ${client.name} (SOW/MSA).`);
    await fireN8nEvent({ name:'CONTRACT_SIGNED', client: client.name, payload: { id: client.id }});
    setStep(2);
  }

  async function scheduleKickoff() {
    if (!client.zohoMeetingUrl) { 
      alert('Paste Zoho Meeting URL first'); 
      return; 
    }
    setMilestones(ms => ms.map(m => m.type==='Kickoff'? {...m, status:'Done'} : m));
    await postToSlack(`📅 Kickoff scheduled for ${client.name}: ${client.zohoMeetingUrl}`);
    await fireN8nEvent({ name:'KICKOFF_SCHEDULED', client: client.name, payload: { meetingUrl: client.zohoMeetingUrl }});
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-slate-900" />
          <span className="text-sm font-semibold text-slate-900">SecureForce</span>
        </div>
        <div className="text-xs text-slate-500">Welcome, {client.primaryContact.name}</div>
      </header>

      {/* Hero / Wizard */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="mb-6">
          <h1 className="text-center text-xl font-semibold text-slate-900">Welcome to Your Salesforce Security Journey</h1>
          <p className="mt-1 text-center text-sm text-slate-600">Let's get you set up—just a few steps.</p>
          
          {/* Stepper */}
          <div className="mt-6 flex justify-center">
            <Stepper step={step} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Step 1 */}
            <WizardCard
              title="1  Service Contract"
              desc="Confirm your selected security package and sign."
              footer={
                <button 
                  className={btn} 
                  onClick={markContractSigned}
                  disabled={step > 1}
                >
                  {step > 1 ? '✓ Signed' : '✓ Sign Agreement'}
                </button>
              }
            >
              <label className="block text-xs font-medium text-slate-700">Package</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                defaultValue="Security Assessment Pro"
              >
                <option>Security Assessment Pro</option>
                <option>Monitoring Retainer</option>
                <option>Backup & DR Testing</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Zoho Contract ID (optional)"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  onChange={e=>setClient({...client, zohoContractId: e.target.value })}
                />
                <input
                  placeholder="Zoho Meeting URL (optional)"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  onChange={e=>setClient({...client, zohoMeetingUrl: e.target.value })}
                />
              </div>
            </WizardCard>

            {/* Step 2 */}
            <WizardCard
              title="2  System Information"
              desc="Tell us about your Salesforce environment."
              footer={
                <button 
                  className={btnGhost} 
                  onClick={()=>setStep(3)}
                  disabled={step < 2}
                >
                  Complete System Survey →
                </button>
              }
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Salesforce Edition</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    onChange={e=>setClient({...client, edition: e.target.value as Client['edition'] })}
                  >
                    <option>Professional</option>
                    <option>Enterprise</option>
                    <option>Unlimited</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Number of Users</label>
                  <input type="number" min={1}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    onChange={e=>setClient({...client, users: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Key Integrations</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                         placeholder="MuleSoft, Data Cloud, Custom APIs"
                         onChange={e=>setClient({...client, integrations: e.target.value.split(',').map(s=>s.trim()) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Compliance</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                         placeholder="HIPAA, SOC 2, ISO 27001"
                         onChange={e=>setClient({...client, compliance: e.target.value.split(',').map(s=>s.trim()) })}
                  />
                </div>
              </div>
            </WizardCard>

            {/* Step 3 */}
            <WizardCard
              title="3  Schedule Kickoff"
              desc="Pick a slot for our initial planning session."
              footer={
                <button 
                  className={btn} 
                  onClick={scheduleKickoff}
                  disabled={step < 2}
                >
                  Schedule Meeting
                </button>
              }
            >
              <div className="text-xs text-slate-600">Available slots this week:</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button className={btnGhost}>Wed 29 · 2:00 PM</button>
                <button className={btnGhost}>Thu 30 · 10:00 AM</button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Paste your Zoho Meetings link above to attach it to this kickoff.
              </p>
            </WizardCard>
          </div>

          {/* Tell Us About Your System */}
          <div className="mt-8">
            <h2 className="text-center text-lg font-semibold text-slate-900">Tell Us About Your System</h2>
            <p className="text-center text-sm text-slate-600 mb-4">Help us tailor your security approach.</p>
            <div className="mx-auto max-w-3xl grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={card}>
                <div className="text-sm font-medium text-slate-900 mb-3">Client</div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Organization:</span> <span className="font-medium text-slate-900">{client.name}</span></div>
                  <div><span className="text-slate-500">Primary Contact:</span> <span className="font-medium text-slate-900">{client.primaryContact.name}</span></div>
                  <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900">{client.primaryContact.email}</span></div>
                </div>
              </div>
              <div className={card}>
                <div className="text-sm font-medium text-slate-900 mb-3">Environment Summary</div>
                <div className="text-sm text-slate-700 space-y-1">
                  <div>Edition: <span className="font-medium">{client.edition ?? '—'}</span></div>
                  <div>Users: <span className="font-medium">{client.users ?? '—'}</span></div>
                  <div>Integrations: <span className="font-medium">{client.integrations?.join(', ') ?? '—'}</span></div>
                  <div>Compliance: <span className="font-medium">{client.compliance?.join(', ') ?? '—'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar + Resources */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Calendar milestones={milestones} />
          <Resources />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-slate-900" />
              <span className="text-sm font-semibold text-slate-900">SecureForce</span>
            </div>
            <p className="mt-2 text-xs text-slate-600">Protecting your Salesforce environment with enterprise-grade security solutions.</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Services</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Security Assessment</li>
              <li>Compliance Audit</li>
              <li>User Training</li>
              <li>Monitoring Setup</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Support</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Documentation</li>
              <li>Contact Support</li>
              <li>Community</li>
              <li>Status Page</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Contact</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>support@secureforce.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">© 2025 SecureForce. All rights reserved.</div>
      </footer>
    </div>
  );
}
