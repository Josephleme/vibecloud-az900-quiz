import React, { useState } from 'react';
import {
  Network, HelpCircle, LayoutGrid, CheckCircle2, ShieldAlert, Cpu, Server,
  Sparkles, ExternalLink, ArrowRight, XCircle, RotateCcw,
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

export default function App() {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'advanced' | 'expert'>('basic');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [activeClarification, setActiveClarification] = useState<number | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [matchFeedback, setMatchFeedback] = useState<string>('');
  const [matchVerified, setMatchVerified] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
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
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
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
