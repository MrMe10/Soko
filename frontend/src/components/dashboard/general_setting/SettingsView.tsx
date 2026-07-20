import { useState } from 'react'
import {
  Sliders,
  Key,
  Server,
  Save,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react'

export default function SettingsView() {
  const [apiKey, setApiKey] = useState('sk_soko_9012a84fb8e94a82b9e1e2d83c4416')
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Setting states
  const [lowStockPercent, setLowStockPercent] = useState(20)
  const [replicationFactor, setReplicationFactor] = useState(3)
  const [enableCoolingAuto, setEnableCoolingAuto] = useState(true)
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState('https://api.soko.io/v1/webhook')

  // Integrations state
  const [integrations, setIntegrations] = useState({
    supabase: { enabled: true, showConfig: false, val: 'https://supabase.soko-instance.co' },
    pinecone: { enabled: true, showConfig: false, val: 'us-east-1.pinecone.io' },
    mongodb: { enabled: true, showConfig: false, val: 'mongodb+srv://admin:soko-repl-1@db.soko.io' },
    react: { enabled: true, showConfig: false, val: 'http://localhost:5173' },
    nextjs: { enabled: false, showConfig: false, val: '' },
    angular: { enabled: false, showConfig: false, val: '' }
  })

  const handleToggleIntegration = (id: keyof typeof integrations) => {
    setIntegrations(prev => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled }
    }))
  }

  const handleToggleConfig = (id: keyof typeof integrations) => {
    setIntegrations(prev => ({
      ...prev,
      [id]: { ...prev[id], showConfig: !prev[id].showConfig }
    }))
  }

  const handleConfigChange = (id: keyof typeof integrations, value: string) => {
    setIntegrations(prev => ({
      ...prev,
      [id]: { ...prev[id], val: value }
    }))
  }

  // Copy API key handler
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate new API key
  const handleGenerateKey = () => {
    const randomHex = Array.from({ length: 30 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    setApiKey(`sk_soko_${randomHex}`)
  }

  // Form submit handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }, 1200)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 m-0">Soko System Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">Control physical shelf parameters, replication indexes, and webhook triggers.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Settings Group (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Physical Shelving Constraints */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-indigo-550" />
              Storehouse & Rack Policies
            </h3>

            <div className="space-y-4 font-sans text-xs text-slate-700">
              
              {/* Low stock threshold slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px] font-bold text-slate-500 uppercase">
                  <span>Low Stock Alert Trigger</span>
                  <span className="text-indigo-650 text-xs">{lowStockPercent}% Volume</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={lowStockPercent}
                  onChange={(e) => setLowStockPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-[10px] text-slate-450 block leading-tight">
                  Triggers Amber warnings on the LED panels and Dashboard ledger when storage unit volume drops below this threshold.
                </span>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Shard replica factor */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px] font-bold text-slate-500 uppercase">
                  <span>Database Replication Factor</span>
                  <span className="text-indigo-650 text-xs">{replicationFactor}x Shards</span>
                </div>
                <div className="flex gap-4">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReplicationFactor(num)}
                      className={`flex-1 py-2 text-center rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                        replicationFactor === num
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-755 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-455 block leading-tight">
                  Ensures digital storage data integrity blocks are duplicated across multiple hardware partitions in real-time.
                </span>
              </div>

            </div>
          </div>

          {/* Webhook API credentials */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Key className="w-4 h-4 text-indigo-550" />
              API Credentials & Webhooks
            </h3>

            <div className="space-y-4 font-sans text-xs text-slate-700">
              
              {/* API Key generator */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Secret API Token
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 font-mono text-[11px] text-slate-655 flex items-center justify-between select-all overflow-x-auto whitespace-nowrap">
                    <span>{apiKey}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg text-slate-600 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    title="Copy Key"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateKey}
                    className="p-2 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg text-slate-600 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    title="Regenerate Key"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Webhook endpoint */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Event Webhook Dispatcher
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

            </div>
          </div>

          {/* Database & Framework Integrations Matrix */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 block shrink-0" />
              Connected Data Stores & Adapters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'supabase', name: 'Supabase DB', logo: '/t_supabase-icon9119.logowik.com.png', type: 'Database Connection' },
                { id: 'pinecone', name: 'Pinecone Index', logo: '/t_pinecone-database4602.logowik.com.png', type: 'Vector Database' },
                { id: 'mongodb', name: 'MongoDB Hub', logo: '/external-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png', type: 'Document DB' },
                { id: 'react', name: 'React Adapter', logo: '/React-Logo.png', type: 'Client Framework' },
                { id: 'nextjs', name: 'Next.js SDK', logo: '/nextjs7685.logowik.com.png', type: 'App Router SDK' },
                { id: 'angular', name: 'Angular Client', logo: '/angular-icon-logo.png', type: 'SPA Client' }
              ].map((tech) => {
                const item = integrations[tech.id as keyof typeof integrations]
                return (
                  <div key={tech.id} className={`p-4 border rounded-xl transition-all duration-200 ${
                    item.enabled ? 'border-slate-200 bg-white shadow-xs' : 'border-slate-100 bg-slate-50/50 opacity-70'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 p-1.5 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-center relative overflow-hidden shrink-0">
                          <img src={tech.logo} alt={tech.name} className={`w-full h-full object-contain ${item.enabled ? '' : 'filter grayscale'}`} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{tech.name}</h4>
                          <span className="text-[10px] text-slate-450 block mt-0.5 leading-none">{tech.type}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleIntegration(tech.id as keyof typeof integrations)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                          item.enabled ? 'bg-indigo-650' : 'bg-slate-200'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-xs transform transition-transform duration-250 ${
                          item.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {item.enabled && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleConfig(tech.id as keyof typeof integrations)}
                          className="text-[10px] font-semibold text-indigo-650 hover:text-indigo-850 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {item.showConfig ? 'Collapse Connection' : 'Configure Credentials'}
                        </button>
                        <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          ONLINE
                        </span>
                      </div>
                    )}

                    {item.enabled && item.showConfig && (
                      <div className="mt-3 space-y-2">
                        <input
                          type={tech.id.includes('db') || tech.id.includes('supabase') || tech.id.includes('mongodb') || tech.id.includes('pinecone') ? 'password' : 'text'}
                          placeholder={tech.id.includes('db') || tech.id.includes('supabase') || tech.id.includes('mongodb') || tech.id.includes('pinecone') ? 'Enter Connection URI / Secret Key' : 'Enter Adapter Port / Base Path'}
                          value={item.val}
                          onChange={(e) => handleConfigChange(tech.id as keyof typeof integrations, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                        <span className="text-[9px] font-mono text-slate-455 block leading-tight">
                          Credentials are encrypted with AES-256-GCM.
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right side: Preferences & Actions (1 column) */}
        <div className="space-y-6">
          
          {/* Hardware & System settings */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Server className="w-4 h-4 text-indigo-550" />
              Environment Automation
            </h3>

            <div className="space-y-4 text-xs font-sans text-slate-700">
              
              {/* Auto cooling system */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-slate-900">Auto Cooling Regulator</span>
                  <span className="text-[10px] text-slate-455">Dynamically triggers coolant flow vectors.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableCoolingAuto(!enableCoolingAuto)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    enableCoolingAuto ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    enableCoolingAuto ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="h-px bg-slate-100" />

              {/* sound alerts toggling */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-slate-900">Audible Siren System</span>
                  <span className="text-[10px] text-slate-455">Fires console sounds on critical stock alert.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableSoundAlerts(!enableSoundAlerts)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    enableSoundAlerts ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    enableSoundAlerts ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-3">
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className="w-full bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-xs font-semibold shadow shadow-indigo-650/15 hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Server Changes</span>
                </>
              )}
            </button>
            <span className="text-[9px] font-mono text-slate-450 block text-center leading-tight">
              Saves are compiled and broadcast instantly to Node-718 arrays.
            </span>
          </div>

        </div>

      </form>

    </div>
  )
}
