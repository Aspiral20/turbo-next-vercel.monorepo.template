'use client';
import { X, ChevronLeft, Mail, Clock, GitBranch, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ModalShell, modalCls } from '@/_components/ui/ModalShell';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewCampaignModal({ isOpen, onClose }: NewCampaignModalProps) {
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [goal, setGoal] = useState('Book a call');
  const [source, setSource] = useState('Google Maps Leads');
  const [minRating, setMinRating] = useState('4.0');
  const [estimatedLeads] = useState(340);
  const [sequenceSteps, setSequenceSteps] = useState([
    { id: 1, type: 'email', subject: '', body: '' }
  ]);
  const [senderEmail, setSenderEmail] = useState('john@company.com');
  const [dailyLimit, setDailyLimit] = useState('50');
  const [startNow, setStartNow] = useState(true);

  const steps = [
    { number: 1, label: 'Setup' },
    { number: 2, label: 'Sequence' },
    { number: 3, label: 'Review' },
  ];

  const handleNext = () => { if (step < 3) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleLaunch = () => onClose();

  const addStep = (type: 'email' | 'wait') => {
    const newId = sequenceSteps.length + 1;
    setSequenceSteps([...sequenceSteps, { id: newId, type, subject: '', body: '' }]);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      {/* Header */}
      <div className={modalCls.header}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl ${modalCls.title}`}>Create New Campaign</h2>
          <button onClick={onClose} className={modalCls.closeBtn}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${step >= s.number ? 'text-[#1A6FFF]' : 'text-gray-400 dark:text-gray-500'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  step > s.number
                    ? 'bg-[#1A6FFF] text-white'
                    : step === s.number
                    ? 'border-2 border-[#1A6FFF] bg-white dark:bg-[#161B22] text-[#1A6FFF]'
                    : modalCls.stepInactive
                }`}>
                  {step > s.number ? '✓' : s.number}
                </div>
                <span className="text-sm">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 w-16 ${step > s.number ? 'bg-[#1A6FFF]' : modalCls.stepConnector}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className={modalCls.body}>
        {/* Step 1 — Setup */}
        {step === 1 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Campaign Name</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Q2 Coffee Shop Outreach"
                className={modalCls.input}
              />
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Campaign Goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className={modalCls.select}>
                <option>Book a call</option>
                <option>Drive traffic</option>
                <option>Promote offer</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Select Lead Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className={modalCls.select}>
                <option>Google Maps Leads</option>
                <option>LinkedIn Prospects</option>
                <option>Reddit Community</option>
                <option>Apollo Database</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Filter Leads</label>
              <div className="flex flex-wrap gap-2">
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${modalCls.secondary}`}>
                  <span className="text-sm">Rating ≥</span>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="border-none bg-transparent text-sm focus:outline-none text-gray-700 dark:text-gray-300"
                  >
                    <option>3.0</option>
                    <option>4.0</option>
                    <option>4.5</option>
                    <option>5.0</option>
                  </select>
                </div>
                <button className={`rounded-lg px-3 py-2 text-sm ${modalCls.secondary} hover:opacity-80 transition-opacity`}>
                  + Add Filter
                </button>
              </div>
            </div>

            <div className={modalCls.infoBox}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#1A6FFF]" />
                <span className={`text-sm ${modalCls.title}`}>~{estimatedLeads} leads match your criteria</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Sequence */}
        {step === 2 && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className={`text-sm ${modalCls.title} mb-4`}>Build Your Sequence</h3>

            <div className="space-y-4">
              {sequenceSteps.map((seqStep, idx) => (
                <div key={seqStep.id} className="relative pl-8">
                  {idx < sequenceSteps.length - 1 && (
                    <div className={`absolute left-[15px] top-12 bottom-0 w-0.5 ${modalCls.timelineLine}`} />
                  )}
                  <div className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A6FFF] flex-shrink-0">
                    {seqStep.type === 'email'
                      ? <Mail className="h-4 w-4 text-white" />
                      : <Clock className="h-4 w-4 text-white" />
                    }
                  </div>

                  {seqStep.type === 'email' ? (
                    <div className={`${modalCls.card} p-4`}>
                      <div className="mb-3 flex items-center justify-between">
                        <span className={`text-sm ${modalCls.subtext}`}>Email #{idx + 1}</span>
                        <button className="text-xs text-[#1A6FFF] hover:text-[#1557CC]">Remove</button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Subject line"
                          className={modalCls.input}
                        />
                        <div>
                          <textarea
                            placeholder="Email body..."
                            rows={4}
                            className={`${modalCls.input} resize-none`}
                          />
                          <div className="mt-2 flex gap-2">
                            <button className={modalCls.templateBtn}>{'{firstName}'}</button>
                            <button className={modalCls.templateBtn}>{'{businessName}'}</button>
                            <button className={modalCls.templateBtn}>{'{city}'}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-white/5 px-4 py-3`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${modalCls.label}`}>Wait</span>
                        <select className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] text-gray-900 dark:text-white px-3 py-1 text-sm focus:border-[#1A6FFF] focus:outline-none">
                          <option>1 day</option>
                          <option>3 days</option>
                          <option>1 week</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pl-8">
              <button onClick={() => addStep('email')} className={modalCls.addBtn}>
                <Plus className="h-4 w-4" />
                Add Email
              </button>
              <button onClick={() => addStep('wait')} className={modalCls.addBtn}>
                <Plus className="h-4 w-4" />
                Add Wait
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className={`text-sm ${modalCls.title} mb-4`}>Review & Launch</h3>

            <div className={`rounded-xl p-4 space-y-3 ${modalCls.secondary}`}>
              {[
                { label: 'Campaign Name', value: campaignName || 'Untitled Campaign' },
                { label: 'Lead Count', value: `${estimatedLeads} leads` },
                { label: 'Sequence Steps', value: `${sequenceSteps.length} steps` },
                { label: 'Goal', value: goal },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className={`text-sm ${modalCls.subtext}`}>{label}</span>
                  <span className={`text-sm ${modalCls.title}`}>{value}</span>
                </div>
              ))}
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Sender Email</label>
              <select value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className={modalCls.select}>
                <option>john@company.com</option>
                <option>sales@company.com</option>
                <option>outreach@company.com</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Daily Send Limit</label>
              <input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className={modalCls.input}
              />
              <p className={`mt-1 text-xs ${modalCls.subtext}`}>We recommend 50-100 emails per day to maintain deliverability</p>
            </div>

            <div className={`flex items-center justify-between rounded-lg px-4 py-3 ${modalCls.secondary}`}>
              <div>
                <div className={`text-sm ${modalCls.title}`}>Start Now</div>
                <div className={`text-xs ${modalCls.subtext}`}>Campaign will begin immediately</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={startNow}
                  onChange={(e) => setStartNow(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D97E]" />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`${modalCls.footer} flex items-center justify-between`}>
        <button onClick={step === 1 ? onClose : handleBack} className={modalCls.backBtn}>
          {step > 1 && <ChevronLeft className="h-4 w-4" />}
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        {step < 3 ? (
          <button onClick={handleNext} className="rounded-lg bg-[#1A6FFF] px-6 py-2.5 text-sm text-white hover:bg-[#1557CC] transition-colors">
            Next
          </button>
        ) : (
          <button onClick={handleLaunch} className="rounded-lg bg-[#00D97E] px-6 py-2.5 text-sm text-white hover:bg-[#00C06D] transition-colors">
            Launch Campaign
          </button>
        )}
      </div>
    </ModalShell>
  );
}
