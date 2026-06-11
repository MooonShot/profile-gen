import { useState, lazy, Suspense } from 'react'
import { TABS, TAB_DESCS, COUNTRIES, DEFAULT_BBOX } from './data.js'
import { buildProfile, fetchAddresses, downloadCSV, profilesToAYCD } from './utils.js'
import PreviewTable from './PreviewTable.jsx'

const MapPicker = lazy(() => import('./MapPicker.jsx'))

const s = {
  btn: (active) => ({
    background: active ? '#e02020' : '#0d0d14',
    border: `1px solid ${active ? '#e02020' : '#1e1e2e'}`,
    borderRadius: 4,
    padding: '5px 14px',
    color: active ? '#fff' : '#777',
    cursor: 'pointer',
    fontSize: 12,
    transition: 'all .15s',
  }),
  input: {
    width: '100%',
    background: '#0d0d14',
    border: '1px solid #1e1e2e',
    borderRadius: 4,
    padding: '8px 10px',
    color: '#d0d0e0',
    fontSize: 13,
    fontFamily: 'monospace',
  },
}

export default function App() {
  const [tab, setTab] = useState(0)
  const [country, setCountry] = useState('FR')
  const [byMap, setByMap] = useState(false)
  const [mapArea, setMapArea] = useState(null)
  const [qty, setQty] = useState(50)
  const [label, setLabel] = useState('')
  const [sepHouse, setSepHouse] = useState(false)
  const [sepPrefix, setSepPrefix] = useState(false)
  const [dobRange, setDobRange] = useState('none')
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [totalGenerated, setTotalGenerated] = useState(0)

  const [godMode, setGodMode] = useState(false)
  const [showGodInput, setShowGodInput] = useState(false)
  const [godCode, setGodCode] = useState('')
  const [godError, setGodError] = useState(false)

  function attemptGodMode() {
    if (godCode.trim() === 'JATTUSGOAT') {
      setGodMode(true)
      setShowGodInput(false)
      setGodError(false)
      setGodCode('')
    } else {
      setGodError(true)
      setTimeout(() => setGodError(false), 1500)
    }
  }

  async function generate() {
    const limit = godMode ? 5000 : 500
    const count = Math.min(Math.max(1, parseInt(qty) || 50), limit)
    const bbox = mapArea?.bbox || DEFAULT_BBOX[country]
    setLoading(true)
    setStatus('Fetching addresses from Mapbox...')

    try {
      let addresses = []
      if (tab === 0 || tab === 1) {
        addresses = await fetchAddresses(bbox, count)
        setStatus(`Got ${addresses.length} real addresses`)
      }

      const result = Array.from({ length: count }, (_, i) =>
        buildProfile({ tab, country, addresses, index: i, sepHouse, sepPrefix, dobRange })
      )

      setProfiles(result)
      setTotalGenerated(t => t + result.length)
      const lbl = label ? ` — "${label}"` : ''
      setStatus(`✓ ${result.length.toLocaleString()} profiles generated${lbl} · ${COUNTRIES[country]}`)
      setShowPreview(false)
    } catch (e) {
      setStatus('Error: ' + e.message)
    }

    setLoading(false)
  }

  function handleDownload() {
    const lbl = label || TABS[tab].split(' ')[0].toLowerCase()
    downloadCSV(profiles, `${lbl}_${country}_${profiles.length}.csv`)
  }

  function handleAYCDDownload() {
    const lbl = label || 'profiles'
    const csv = profilesToAYCD(profiles, country)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${lbl}_${country}_${profiles.length}_aycd.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const usagePct = Math.min(100, (totalGenerated / 100000) * 100)

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: '#0d0d14', borderBottom: '1px solid #1a1a2e', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.3px', color: '#e8e8f0' }}>Profile Generator</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Generate profiles using real Mapbox geocoded addresses</div>
          </div>
          <button
            onClick={() => godMode ? setGodMode(false) : setShowGodInput(p => !p)}
            style={{
              background: godMode ? 'linear-gradient(135deg,#ff6a00,#e02020)' : '#0d0d14',
              border: `1px solid ${godMode ? '#ff6a00' : '#2a2a3e'}`,
              borderRadius: 6, padding: '7px 14px', cursor: 'pointer', fontSize: 12,
              color: godMode ? '#fff' : '#555', fontWeight: godMode ? 700 : 400,
              letterSpacing: godMode ? '0.5px' : 0,
            }}
          >
            {godMode ? '⚡ GOD MODE' : '🔒 God Mode'}
          </button>
        </div>

        {/* God mode input */}
        {showGodInput && !godMode && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="password"
              placeholder="Enter code..."
              value={godCode}
              onChange={e => setGodCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && attemptGodMode()}
              autoFocus
              style={{
                background: godError ? '#1a0808' : '#0a0a10',
                border: `1px solid ${godError ? '#e02020' : '#2a2a3e'}`,
                borderRadius: 4, padding: '7px 12px', color: '#d0d0e0',
                fontSize: 13, fontFamily: 'monospace', width: 200,
                transition: 'border-color .2s',
              }}
            />
            <button onClick={attemptGodMode} style={{ background: '#e02020', border: 'none', borderRadius: 4, padding: '7px 16px', color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              Unlock
            </button>
            {godError && <span style={{ fontSize: 12, color: '#e02020', fontFamily: 'monospace' }}>Invalid code</span>}
          </div>
        )}

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 4, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${usagePct}%`, background: '#e02020', borderRadius: 2, transition: 'width .4s' }} />
          </div>
          <span style={{ fontSize: 11, color: '#444', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
            {totalGenerated.toLocaleString()} / 100,000
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1a1a2e', marginBottom: 18, overflowX: 'auto' }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: '10px 16px', background: 'none', border: 'none',
              borderBottom: tab === i ? '2px solid #e02020' : '2px solid transparent',
              color: tab === i ? '#e02020' : '#555', cursor: 'pointer', fontSize: 13,
              fontWeight: tab === i ? 600 : 400, whiteSpace: 'nowrap',
            }}>
              {t}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#555', marginBottom: 16, lineHeight: 1.6 }}>{TAB_DESCS[tab]}</p>

        {/* Country / Map toggle */}
        <div style={{ display: 'flex', marginBottom: 14 }}>
          <button onClick={() => setByMap(false)} style={{ flex: 1, padding: '9px 0', background: byMap ? '#0d0d14' : '#1e1e2e', border: '1px solid #1e1e2e', borderRadius: '4px 0 0 4px', color: byMap ? '#555' : '#d0d0e0', cursor: 'pointer', fontSize: 13, fontWeight: byMap ? 400 : 600 }}>
            By Country
          </button>
          <button onClick={() => setByMap(true)} style={{ flex: 1, padding: '9px 0', background: byMap ? '#e02020' : '#0d0d14', border: `1px solid ${byMap ? '#e02020' : '#1e1e2e'}`, borderRadius: '0 4px 4px 0', color: byMap ? '#fff' : '#555', cursor: 'pointer', fontSize: 13, fontWeight: byMap ? 600 : 400 }}>
            By Map
          </button>
        </div>

        {/* Country grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {Object.entries(COUNTRIES).map(([c, name]) => (
            <button key={c} onClick={() => setCountry(c)} style={s.btn(country === c)}>
              {name}
            </button>
          ))}
        </div>

        {/* Map */}
        {byMap && (
          <div style={{ marginBottom: 16 }}>
            <Suspense fallback={<div style={{ height: 320, background: '#0d0d14', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: 13 }}>Loading map...</div>}>
              <MapPicker country={country} onAreaSelect={setMapArea} />
            </Suspense>
            {mapArea && (
              <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace', marginTop: 6 }}>
                1 area selected — {mapArea.label}
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>
              Quantity {godMode ? <span style={{ color: '#ff6a00', fontWeight: 700 }}>⚡ max 5,000</span> : '(max 500)'}
            </label>
            <input type="number" min={1} max={godMode ? 5000 : 500} value={qty} onChange={e => setQty(e.target.value)} style={s.input} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Label (optional)</label>
            <input type="text" placeholder="e.g. Paris batch" value={label} onChange={e => setLabel(e.target.value)} style={{ ...s.input, fontFamily: 'inherit' }} />
          </div>
        </div>

        {tab !== 2 && (
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
            {(tab === 0 || tab === 1) && (
              <label style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={sepHouse} onChange={e => setSepHouse(e.target.checked)} style={{ accentColor: '#e02020' }} />
                Separate house number
              </label>
            )}
            {(tab === 0 || tab === 3) && (
              <label style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={sepPrefix} onChange={e => setSepPrefix(e.target.checked)} style={{ accentColor: '#e02020' }} />
                Separate phone prefix
              </label>
            )}
          </div>
        )}

        {tab === 0 && (
          <div style={{ marginBottom: 18, maxWidth: 220 }}>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Date of birth</label>
            <select value={dobRange} onChange={e => setDobRange(e.target.value)} style={{ ...s.input, fontFamily: 'inherit' }}>
              <option value="none">None</option>
              <option value="18-25">18–25</option>
              <option value="25-35">25–35</option>
              <option value="35-50">35–50</option>
              <option value="18-60">18–60 (random)</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <button onClick={generate} disabled={loading} style={{
            flex: 1, background: loading ? '#3a1010' : '#e02020', border: 'none', borderRadius: 4,
            padding: '11px 0', color: loading ? '#885555' : '#fff', fontSize: 14, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '⟳ Fetching...' : 'Generate Profiles'}
          </button>
          {profiles.length > 0 && (
            <>
              <button onClick={() => setShowPreview(p => !p)} style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 4, padding: '11px 14px', color: '#888', fontSize: 13, cursor: 'pointer' }}>
                {showPreview ? 'Hide' : 'Preview'}
              </button>
              <button onClick={handleDownload} style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 4, padding: '11px 14px', color: '#888', fontSize: 13, cursor: 'pointer' }}>
                ↓ CSV
              </button>
              <button onClick={handleAYCDDownload} style={{ background: '#0d0d14', border: '1px solid #e02020', borderRadius: 4, padding: '11px 14px', color: '#e02020', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                ↓ AYCD
              </button>
            </>
          )}
        </div>

        {status && (
          <div style={{ fontSize: 11, color: status.startsWith('✓') ? '#2a9d2a' : '#555', fontFamily: 'monospace', marginBottom: 10 }}>
            {status}
          </div>
        )}

        {showPreview && <PreviewTable profiles={profiles} />}
      </div>
    </div>
  )
}