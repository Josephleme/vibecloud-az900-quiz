import React, { useState } from 'react';
import {
  Network, HelpCircle, LayoutGrid, CheckCircle2, ShieldAlert, Cpu, Server,
  Globe, Sparkles, ExternalLink, ArrowRight, XCircle, RotateCcw,
  Boxes, Shield, GitBranch, Workflow, Layers,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  geminiPrompt: string;
}

const quizTiers: Record<'basic' | 'advanced' | 'expert', Question[]> = {
  basic: [
    {
      id: 101,
      question: "What is the primary definition of Cloud Computing?",
      options: [
        "Buying physical servers to store data locally in your office building.",
        "The delivery of computing services—including servers, storage, databases, and networking—over the internet.",
        "A software program used exclusively for editing videos online.",
        "A private wireless network setup that doesn't use any external cables."
      ],
      correctAnswer: 1,
      explanation: "Think of cloud computing like buying electricity from a power grid instead of running your own generator. You pull computing resources over the internet and pay only for what you consume.",
      geminiPrompt: "Explain the absolute basics of Cloud Computing and Microsoft Azure using a simple real-life marketplace analogy for a complete beginner."
    },
    {
      id: 102,
      question: "Which cloud concept describes an application's ability to automatically scale down when traffic drops to save costs?",
      options: [
        "High Availability",
        "Predictive Latency",
        "Elasticity",
        "Fault Tolerance"
      ],
      correctAnswer: 2,
      explanation: "Elasticity works like a rubber band. When your app gets busy, it expands to handle the crowd. When the crowd leaves, it shrinks back down so you stop paying for idle servers.",
      geminiPrompt: "Explain Cloud Elasticity versus Cloud Scalability in simple terms with everyday real-world examples."
    },
    {
      id: 103,
      question: "What type of expenditure is characterized by spending money up-front on physical infrastructure, which reduces your taxes over time?",
      options: [
        "Operational Expenditure (OpEx)",
        "Capital Expenditure (CapEx)",
        "Fixed Compliance Cost",
        "Variable Maintenance Outlay"
      ],
      correctAnswer: 1,
      explanation: "CapEx is buying a building or massive hardware up front. OpEx is paying a subscription for resources you rent. Cloud computing shifts your business model from CapEx to OpEx.",
      geminiPrompt: "Explain CapEx vs OpEx in cloud computing like I am 5 years old."
    },
    {
      id: 104,
      question: "Which Azure service provides a managed, cloud-based directory service for user authentication and identity management?",
      options: [
        "Microsoft Entra ID",
        "Azure Key Vault",
        "Azure Information Protection",
        "Azure Bastion"
      ],
      correctAnswer: 0,
      explanation: "Microsoft Entra ID (formerly Azure Active Directory) handles identities, logins, multi-factor authentication, and access permissions safely across your tenants.",
      geminiPrompt: "Explain Microsoft Entra ID basics for user access management using an office security guard analogy."
    }
  ],
  advanced: [
    {
      id: 201,
      question: "You need to run a background data processing script but want zero infrastructure management and only want to pay when the script executes. What should you use?",
      options: [
        "Azure Virtual Machines (IaaS)",
        "Azure Functions (Serverless Compute)",
        "Azure App Services (PaaS)",
        "Azure Container Instances"
      ],
      correctAnswer: 1,
      explanation: "Azure Functions are serverless. Code executes based on events or triggers. Microsoft handles all underlying servers, and you are billed down to the millisecond only while your code runs.",
      geminiPrompt: "Explain Azure Functions and Serverless computing using a restaurant or transit analogy."
    },
    {
      id: 202,
      question: "Which Azure service establishes a secure, private, high-speed dedicated physical connection that bypasses the public internet entirely?",
      options: [
        "Azure VPN Gateway",
        "Azure ExpressRoute",
        "Azure Virtual Network (VNet) Peering",
        "Azure Bastion Host"
      ],
      correctAnswer: 1,
      explanation: "ExpressRoute is a dedicated private pipeline leased from a telecommunications partner directly into Microsoft's network backbone for ultimate speed, security, and privacy.",
      geminiPrompt: "Deep dive explanation of Azure ExpressRoute vs Azure VPN. When should an enterprise choose ExpressRoute?"
    },
    {
      id: 203,
      question: "You need to host a secure containerized web application without managing virtual machine clusters or configuring complex orchestration. Which service fits best?",
      options: [
        "Azure Virtual Machines",
        "Azure Container Instances (ACI)",
        "Azure Dedicated Host",
        "Azure Functions"
      ],
      correctAnswer: 1,
      explanation: "ACI allows you to deploy isolated containers directly onto Azure instantly without any virtual machine provisioning or management overhead.",
      geminiPrompt: "Explain Azure Container Instances versus fully managed virtual machines for beginners."
    }
  ],
  expert: [
    {
      id: 301,
      question: "An organization wants to enforce a rule ensuring that developers can only deploy resources inside specific geographic boundaries (e.g., inside South Africa data centers). What should they implement?",
      options: [
        "Azure Blueprints definition layers",
        "Microsoft Entra ID Conditional Access Rules",
        "Azure Policy assignments",
        "Resource Group structural locks"
      ],
      correctAnswer: 2,
      explanation: "Azure Policy is used to create, assign, and manage rules over your resources. It actively prevents developers from spinning up resources outside allowed geographical regions to ensure data sovereignty compliance.",
      geminiPrompt: "Explain the difference between Azure Policy, Azure Role-Based Access Control (RBAC), and Resource Locks with clear architectural use cases."
    },
    {
      id: 302,
      question: "Which pillar of the Azure Well-Architected Framework focuses on structural defense mechanics, data encryption states, and security threat prevention matrices?",
      options: [
        "Operational Excellence",
        "Performance Efficiency",
        "Cost Optimization",
        "Security"
      ],
      correctAnswer: 3,
      explanation: "The Security pillar ensures robust data protection at rest and in transit, unified identity authentication management, and rapid network boundary protection layers against intrusions.",
      geminiPrompt: "Give me a breakdown of the 5 pillars of the Microsoft Azure Well-Architected Framework with simplified corporate examples."
    },
    {
      id: 303,
      question: "Which tool should an architecture team use to estimate and compare total running costs of a new cloud configuration before deploying any resources?",
      options: [
        "Azure Pricing Calculator",
        "Azure Advisor",
        "Azure Cost Management + Billing",
        "Total Cost of Ownership (TCO) Calculator"
      ],
      correctAnswer: 0,
      explanation: "The Pricing Calculator estimates architecture costs for configurations pre-deployment. The TCO Calculator is utilized before migration to compare cloud consumption directly against on-premise infrastructure data assets.",
      geminiPrompt: "Explain Azure Pricing Calculator vs TCO Calculator vs Cost Management with specific business deployment scenarios."
    }
  ]
};

const interactiveMatchItems = [
  { id: 'm1', name: 'Azure Functions', matchId: 'A', text: 'Serverless / Event-driven compute' },
  { id: 'm2', name: 'Azure ExpressRoute', matchId: 'B', text: 'Private, dedicated network connection' },
  { id: 'm3', name: 'Azure Cosmos DB', matchId: 'C', text: 'Globally distributed NoSQL database' },
  { id: 'm4', name: 'Azure Blob Storage', matchId: 'D', text: 'Unstructured object storage for files' }
];

const matchTargets = [
  { matchId: 'A', text: 'Serverless / Event-driven compute' },
  { matchId: 'B', text: 'Private, dedicated network connection' },
  { matchId: 'C', text: 'Globally distributed NoSQL database' },
  { matchId: 'D', text: 'Unstructured object storage for files' }
];

const tierConfig: Record<'basic' | 'advanced' | 'expert', { label: string; color: string; description: string }> = {
  basic: { label: 'Basic', color: 'emerald', description: 'Foundational cloud concepts & terminology' },
  advanced: { label: 'Advanced', color: 'amber', description: 'Azure service architecture & compute models' },
  expert: { label: 'Expert', color: 'rose', description: 'Governance, policy & Well-Architected Framework' },
};

const tierColors: Record<string, { bg: string; text: string; border: string; ring: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500', ring: 'ring-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500', ring: 'ring-amber-500', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  rose: { bg: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500', ring: 'ring-rose-500', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
};

// ─── Architecture Diagram Patterns ───

interface DiagramNode {
  title: string;
  subtitle: string;
  detail: string;
}

interface ArchitecturePattern {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: typeof Network;
  center: DiagramNode;
  top: DiagramNode;
  bottom: DiagramNode;
  left: DiagramNode;
  right: DiagramNode;
}

const diagramPatterns: ArchitecturePattern[] = [
  {
    id: 'context',
    title: 'Context & Macro Architecture',
    shortTitle: 'Context & Macro',
    description: 'High-level view of how your entire Azure estate connects to users, partners, and the public internet.',
    icon: Globe,
    center: { title: 'Azure Cloud Tenant', subtitle: 'Core organizational boundary', detail: 'All subscriptions, resources, and billing live inside this tenant. Managed via Microsoft Entra ID.' },
    top: { title: 'End Users', subtitle: 'Public internet clients', detail: 'Web & mobile users access your apps through Azure Front Door and CDN endpoints globally.' },
    bottom: { title: 'On-Premises DC', subtitle: 'Legacy data center', detail: 'Connected via ExpressRoute or VPN Gateway for hybrid cloud workloads and migration scenarios.' },
    left: { title: 'Partner APIs', subtitle: 'Third-party integrations', detail: 'External SaaS providers and partner systems connect through API Management and Logic Apps.' },
    right: { title: 'Azure Regions', subtitle: 'Geo-redundancy', detail: 'Paired regions (e.g., South Africa North + West) ensure business continuity during regional outages.' },
  },
  {
    id: 'network',
    title: 'Network & Topology',
    shortTitle: 'Network & Topology',
    description: 'How virtual networks, subnets, firewalls, and traffic routing are structured inside Azure.',
    icon: Network,
    center: { title: 'Azure VNet', subtitle: 'Core virtual network', detail: 'Primary network space (10.0.0.0/16) hosting all subnets, NSGs, and route tables for your workloads.' },
    top: { title: 'Application Gateway', subtitle: 'WAF & L7 load balancing', detail: 'Web Application Firewall inspects incoming HTTP traffic and distributes load across backend pools.' },
    bottom: { title: 'Azure Firewall', subtitle: 'Egress filtering & NAT', detail: 'Controls outbound traffic with DNAT/SNAT rules. Threat intelligence mode blocks known malicious IPs.' },
    left: { title: 'Bastion Host', subtitle: 'Secure RDP / SSH access', detail: 'Provides seamless TLS-based remote access to VMs without exposing public IP addresses.' },
    right: { title: 'VNet Peering', subtitle: 'Cross-VNet connectivity', detail: 'Low-latency private links between VNets in different subscriptions or regions without gateways.' },
  },
  {
    id: 'deployment',
    title: 'Deployment & Infrastructure',
    shortTitle: 'Deployment & Infra',
    description: 'Compute models, container orchestration, and CI/CD pipelines used to ship workloads to Azure.',
    icon: Boxes,
    center: { title: 'Azure Kubernetes Service', subtitle: 'Container orchestration', detail: 'Managed K8s cluster auto-scales nodes and pods. Integrates with Azure Container Registry for images.' },
    top: { title: 'Azure DevOps', subtitle: 'CI/CD pipelines', detail: 'Build, test, and deploy via YAML pipelines. Artifacts feed directly into AKS and App Service slots.' },
    bottom: { title: 'Azure Functions', subtitle: 'Serverless compute', detail: 'Event-driven micro-services that scale to zero. Triggered by Event Grid, Service Bus, or HTTP calls.' },
    left: { title: 'App Service', subtitle: 'Managed PaaS hosting', detail: 'Auto-scaling web apps with deployment slots for zero-downtime swaps between staging and production.' },
    right: { title: 'Container Registry', subtitle: 'Private image store', detail: 'Geo-replicated Docker registry with webhook triggers and integrated vulnerability scanning.' },
  },
  {
    id: 'dataflow',
    title: 'Data-Flow & Security',
    shortTitle: 'Data-Flow & Security',
    description: 'How data moves through storage layers, encryption boundaries, and identity checkpoints.',
    icon: Shield,
    center: { title: 'Azure Key Vault', subtitle: 'Secrets & key management', detail: 'Centralized store for encryption keys, certificates, and connection strings. Access controlled via RBAC.' },
    top: { title: 'Microsoft Entra ID', subtitle: 'Identity provider', detail: 'Issues JWT tokens for authenticated users and managed identities. Conditional Access policies gate logins.' },
    bottom: { title: 'Azure Storage', subtitle: 'Encrypted blob & file', detail: 'Data encrypted at rest with customer-managed keys from Key Vault. Soft-delete and versioning enabled.' },
    left: { title: 'Azure SQL DB', subtitle: 'Relational data store', detail: 'Always Encrypted + TDE protect sensitive columns. Transparent failover via auto-failover groups.' },
    right: { title: 'Cosmos DB', subtitle: 'Globally distributed NoSQL', detail: 'Multi-master writes with five consistency levels. Changefeed triggers Azure Functions on data mutations.' },
  },
  {
    id: 'sequence',
    title: 'Sequence & Interaction',
    shortTitle: 'Sequence & Interaction',
    description: 'Step-by-step request lifecycle showing how each Azure service interacts in order.',
    icon: Workflow,
    center: { title: 'API Management', subtitle: 'Request gateway', detail: 'Validates API keys, enforces rate limits, and routes authenticated calls to backend services.' },
    top: { title: 'Event Grid', subtitle: 'Event distribution', detail: 'Routes events from Azure resources to subscribers (Functions, Logic Apps) via a publish-subscribe model.' },
    bottom: { title: 'Service Bus', subtitle: 'Reliable messaging', detail: 'Transactional queues and topics guarantee message ordering and at-least-once delivery for decoupled services.' },
    left: { title: 'Logic Apps', subtitle: 'Workflow orchestration', detail: 'Visual designer chains connectors and API calls into automated business processes with retry policies.' },
    right: { title: 'Azure Monitor', subtitle: 'Telemetry & alerts', detail: 'Collects metrics and logs across all services. Triggers alerts and auto-scaling rules based on thresholds.' },
  },
];

// ─── Hub-and-Spoke Diagram Component ───

function HubSpokeDiagram({ pattern }: { pattern: ArchitecturePattern }) {
  const positions = [
    { key: 'top', node: pattern.top, className: 'md:top-0 md:left-1/2 md:-translate-x-1/2 md:translate-y-0', label: 'North' },
    { key: 'right', node: pattern.right, className: 'md:top-1/2 md:right-0 md:-translate-y-1/2 md:translate-x-0', label: 'East' },
    { key: 'bottom', node: pattern.bottom, className: 'md:bottom-0 md:left-1/2 md:-translate-x-1/2 md:translate-y-0', label: 'South' },
    { key: 'left', node: pattern.left, className: 'md:top-1/2 md:left-0 md:-translate-y-1/2 md:translate-x-0', label: 'West' },
  ];

  return (
    <div className="relative w-full">
      {/* Desktop radial layout */}
      <div className="hidden md:block relative h-[540px] bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden">
        {/* SVG connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 540" preserveAspectRatio="none">
          <line x1="400" y1="270" x2="400" y2="100" stroke="url(#gradTop)" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="400" y1="270" x2="680" y2="270" stroke="url(#gradRight)" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="400" y1="270" x2="400" y2="440" stroke="url(#gradBottom)" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="400" y1="270" x2="120" y2="270" stroke="url(#gradLeft)" strokeWidth="2" strokeDasharray="6 4" />
          <defs>
            <linearGradient id="gradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradRight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradBottom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradLeft" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Arrowheads */}
          <circle cx="400" cy="100" r="4" fill="#a855f7" />
          <circle cx="680" cy="270" r="4" fill="#a855f7" />
          <circle cx="400" cy="440" r="4" fill="#a855f7" />
          <circle cx="120" cy="270" r="4" fill="#a855f7" />
        </svg>

        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 z-10">
          <div className="rounded-xl border-2 border-purple-500 bg-gradient-to-br from-purple-600/20 to-indigo-600/10 p-5 shadow-lg shadow-purple-500/10">
            <div className="flex items-center gap-2 mb-1">
              <pattern.icon className="h-5 w-5 text-purple-400" />
              <p className="text-sm font-bold text-white">{pattern.center.title}</p>
            </div>
            <p className="text-xs text-purple-300 mb-2">{pattern.center.subtitle}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{pattern.center.detail}</p>
          </div>
        </div>

        {/* Peripheral nodes */}
        {positions.map(({ key, node, className, label }) => (
          <div key={key} className={`absolute w-56 ${className}`}>
            <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-sm font-bold text-slate-100">{node.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{node.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile stacked layout */}
      <div className="md:hidden space-y-4">
        <div className="rounded-xl border-2 border-purple-500 bg-gradient-to-br from-purple-600/20 to-indigo-600/10 p-5">
          <div className="flex items-center gap-2 mb-1">
            <pattern.icon className="h-5 w-5 text-purple-400" />
            <p className="text-sm font-bold text-white">{pattern.center.title}</p>
          </div>
          <p className="text-xs text-purple-300 mb-2">{pattern.center.subtitle}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{pattern.center.detail}</p>
        </div>
        {positions.map(({ key, node, label }) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-1.5">
              <ArrowRight className="h-3 w-3 text-purple-500 rotate-90" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 ml-5">
              <p className="text-sm font-bold text-slate-100">{node.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{node.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'diagrams'>('quiz');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'advanced' | 'expert'>('basic');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [activeClarification, setActiveClarification] = useState<number | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [matchFeedback, setMatchFeedback] = useState<string>('');
  const [matchVerified, setMatchVerified] = useState<boolean>(false);
  const [selectedPattern, setSelectedPattern] = useState<string>('context');

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleOpenGemini = (promptText: string) => {
    const targetUrl = `https://google.com/search?q=${encodeURIComponent(promptText)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePairBoxes = (targetMatchId: string) => {
    if (!selectedLeft) return;
    setConnections(prev => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        if (updated[key] === targetMatchId) delete updated[key];
      }
      updated[selectedLeft] = targetMatchId;
      return updated;
    });
    setSelectedLeft(null);
    setMatchVerified(false);
    setMatchFeedback('');
  };

  const isMatchCorrect = (itemId: string): boolean => {
    return connections[itemId] === interactiveMatchItems.find(i => i.id === itemId)?.matchId;
  };

  const getConnectedItemIdForTarget = (targetMatchId: string): string | null => {
    for (const key of Object.keys(connections)) {
      if (connections[key] === targetMatchId) return key;
    }
    return null;
  };

  const checkMatchAnswers = () => {
    let correctCount = 0;
    const total = interactiveMatchItems.length;
    interactiveMatchItems.forEach(item => {
      if (connections[item.id] === item.matchId) correctCount++;
    });
    setMatchVerified(true);
    if (correctCount === total) {
      setMatchFeedback(`All ${total} pairs matched correctly. Well done!`);
    } else {
      const wrongCount = total - correctCount;
      setMatchFeedback(`You got ${correctCount} out of ${total} correct. ${wrongCount} ${wrongCount === 1 ? 'pair is' : 'pairs are'} incorrect — shown in red below.`);
    }
  };

  const resetMatcher = () => {
    setConnections({});
    setSelectedLeft(null);
    setMatchFeedback('');
    setMatchVerified(false);
  };

  const tierQuestions = quizTiers[selectedTier];
  const tierInfo = tierConfig[selectedTier];
  const tc = tierColors[tierInfo.color];
  const activePattern = diagramPatterns.find(p => p.id === selectedPattern) ?? diagramPatterns[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-purple-400 flex items-center gap-2">
            <Network className="h-6 w-6 text-purple-500" />
            Smart Quiz Builder
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3 text-amber-500 inline" />
            Unofficial AZ-900 Practice Environment. No Microsoft Logos Used.
          </p>
        </div>

        <nav className="flex space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'quiz' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            1. Progression Quiz & Matcher
          </button>
          <button
            onClick={() => setActiveTab('diagrams')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'diagrams' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            2. Structural Cloud Diagrams
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'quiz' && (
          <div className="space-y-8">
            {/* Intro */}
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Smart Architecture Quiz Builder</h2>
              <p className="text-slate-400 text-sm">
                Advance through structured difficulty levels. Use our built-in <span className="font-semibold text-purple-400">Gemini Clarification system</span> below any question to break down complicated technical vocabulary into simple analogies.
              </p>
            </div>

            {/* Tier Selector */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(quizTiers) as Array<'basic' | 'advanced' | 'expert'>).map(tier => {
                  const info = tierConfig[tier];
                  const colorCls = tierColors[info.color];
                  return (
                    <button
                      key={tier}
                      onClick={() => { setSelectedTier(tier); setActiveClarification(null); }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all flex items-center gap-2 ${
                        selectedTier === tier
                          ? `${colorCls.bg} text-white ${colorCls.border}`
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <Cpu className="h-4 w-4" />
                      {info.label}
                    </button>
                  );
                })}
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full border ${tc.badge}`}>
                {tierInfo.description}
              </span>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-6">
              {tierQuestions.map((q, qIdx) => {
                const userAnswer = userAnswers[q.id];
                const isAnswered = userAnswer !== undefined;
                const isCorrect = isAnswered && userAnswer === q.correctAnswer;
                const showClarification = activeClarification === q.id;

                return (
                  <div
                    key={q.id}
                    className="bg-slate-900 rounded-xl border border-slate-800 p-6 transition-all hover:border-slate-700"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${tc.bg} text-white`}>
                        {qIdx + 1}
                      </span>
                      <p className="text-base font-medium text-slate-100 leading-relaxed">{q.question}</p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 ml-10">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswer === optIdx;
                        const isTheCorrect = optIdx === q.correctAnswer;
                        let cls = 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800';
                        if (isAnswered) {
                          if (isTheCorrect) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                          else if (isSelected) cls = 'border-rose-500 bg-rose-500/10 text-rose-300';
                          else cls = 'border-slate-800 bg-slate-800/30 text-slate-500';
                        } else if (isSelected) {
                          cls = `${tc.border} ${tc.bg}/20 text-slate-100`;
                        }
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            disabled={isAnswered}
                            className={`text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${cls} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold opacity-60">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isAnswered && isTheCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="mt-4 ml-10 space-y-3">
                        <div className={`rounded-lg p-4 border ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                          <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isCorrect ? 'Correct!' : 'Not quite — here is the breakdown:'}
                          </p>
                          <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
                        </div>

                        <button
                          onClick={() => setActiveClarification(showClarification ? null : q.id)}
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          {showClarification ? 'Hide deep-dive' : 'Want a deeper explanation?'}
                        </button>

                        {showClarification && (
                          <div className="rounded-lg p-4 border border-purple-500/30 bg-purple-500/5">
                            <p className="text-xs text-slate-400 mb-3">
                              Click below to open Gemini with a tailored prompt for this question:
                            </p>
                            <button
                              onClick={() => handleOpenGemini(q.geminiPrompt)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all"
                            >
                              <Sparkles className="h-4 w-4" />
                              Ask Gemini for a deep dive
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Matching Game */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-bold text-slate-100">Bonus Spice: Azure Infrastructure Box Matcher</h2>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Click a service on the left, then click its matching description on the right to connect them. Hit <span className="font-semibold text-purple-400">Verify Connected Pairs</span> to check your answers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Azure Service</p>
                  {interactiveMatchItems.map(item => {
                    const connected = connections[item.id];
                    const isSelected = selectedLeft === item.id;
                    const verifiedWrong = matchVerified && connected && !isMatchCorrect(item.id);
                    const verifiedRight = matchVerified && connected && isMatchCorrect(item.id);

                    let borderCls = 'border-slate-700 bg-slate-800/50 text-slate-200 hover:border-slate-600';
                    if (isSelected) {
                      borderCls = `${tc.border} ${tc.bg}/20 ring-2 ${tc.ring} text-white`;
                    } else if (verifiedWrong) {
                      borderCls = 'border-rose-600 bg-rose-950/20 text-rose-300';
                    } else if (verifiedRight) {
                      borderCls = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                    } else if (connected) {
                      borderCls = 'border-slate-700 bg-slate-800/50 text-slate-400';
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedLeft(isSelected ? null : item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between ${borderCls}`}
                      >
                        <span className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-slate-500" />
                          {item.name}
                        </span>
                        <span className="flex items-center gap-2">
                          {verifiedRight && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                          {verifiedWrong && <XCircle className="h-4 w-4 text-rose-400" />}
                          {connected && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" />
                              {connected}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</p>
                  {matchTargets.map(target => {
                    const connectedItemId = getConnectedItemIdForTarget(target.matchId);
                    const isConnected = connectedItemId !== null;
                    const verifiedWrong = matchVerified && isConnected && !isMatchCorrect(connectedItemId!);
                    const verifiedRight = matchVerified && isConnected && isMatchCorrect(connectedItemId!);

                    let borderCls = 'border-slate-800 bg-slate-800/30 text-slate-500 cursor-default';
                    if (verifiedWrong) {
                      borderCls = 'border-rose-600 bg-rose-950/20 text-rose-300 cursor-default';
                    } else if (verifiedRight) {
                      borderCls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 cursor-default';
                    } else if (isConnected) {
                      borderCls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 cursor-default';
                    } else if (selectedLeft) {
                      borderCls = 'border-purple-500 bg-purple-500/10 text-slate-100 hover:bg-purple-500/20 cursor-pointer';
                    }

                    return (
                      <button
                        key={target.matchId}
                        onClick={() => handlePairBoxes(target.matchId)}
                        disabled={!selectedLeft || isConnected}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${borderCls}`}
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                          {target.matchId}
                        </span>
                        <span>{target.text}</span>
                        {verifiedRight && <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto flex-shrink-0" />}
                        {verifiedWrong && <XCircle className="h-4 w-4 text-rose-400 ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controls & Feedback */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={checkMatchAnswers}
                    disabled={Object.keys(connections).length === 0}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Verify Connected Pairs
                  </button>
                  <button
                    onClick={resetMatcher}
                    className="px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
                {matchFeedback && (
                  <p className={`text-sm font-medium ${matchVerified && matchFeedback.includes('incorrect') ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {matchFeedback}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagrams' && (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center justify-center gap-2">
                <Globe className="h-6 w-6 text-purple-400" />
                Structural Cloud Diagrams
              </h2>
              <p className="text-sm text-slate-400">
                Interactive Azure architectural patterns — select a pattern from the left menu.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
              {/* Side Navigation */}
              <aside className="space-y-2">
                {diagramPatterns.map(pattern => {
                  const PatternIcon = pattern.icon;
                  const isActive = selectedPattern === pattern.id;
                  return (
                    <button
                      key={pattern.id}
                      onClick={() => setSelectedPattern(pattern.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                        isActive
                          ? 'border-purple-500 bg-purple-600/10 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      <PatternIcon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{pattern.shortTitle}</p>
                        <p className={`text-xs truncate ${isActive ? 'text-purple-300/70' : 'text-slate-600'}`}>
                          {pattern.id === 'context' && 'Tenant-level overview'}
                          {pattern.id === 'network' && 'VNet & firewall layout'}
                          {pattern.id === 'deployment' && 'Compute & CI/CD'}
                          {pattern.id === 'dataflow' && 'Encryption & identity'}
                          {pattern.id === 'sequence' && 'Request lifecycle'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </aside>

              {/* Diagram Canvas */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const ActiveIcon = activePattern.icon;
                    return (
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                        <ActiveIcon className="h-5 w-5 text-purple-400" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{activePattern.title}</h3>
                    <p className="text-xs text-slate-400">{activePattern.description}</p>
                  </div>
                </div>

                <HubSpokeDiagram pattern={activePattern} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-6 py-4">
        <p className="text-xs text-slate-500 text-center">
          Smart Quiz Builder — Educational practice tool. Not affiliated with Microsoft.
        </p>
      </footer>
    </div>
  );
}
