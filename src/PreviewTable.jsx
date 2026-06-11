export default function PreviewTable({ profiles }) {
  if (!profiles.length) return null
  const keys = Object.keys(profiles[0])

  return (
    <div style={{ overflowX: 'auto', marginTop: 16, borderRadius: 4, border: '1px solid #1a1a2e' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'monospace' }}>
        <thead>
          <tr>
            {keys.map(k => (
              <th key={k} style={{ padding: '6px 10px', borderBottom: '1px solid #1a1a2e', color: '#555', textAlign: 'left', whiteSpace: 'nowrap', background: '#0a0a10' }}>
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {profiles.slice(0, 15).map((p, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#0d0d14' : '#0a0a10' }}>
              {keys.map(k => (
                <td key={k} title={String(p[k] || '')} style={{ padding: '5px 10px', color: '#b0b0c8', whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {String(p[k] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {profiles.length > 15 && (
        <div style={{ fontSize: 11, color: '#444', padding: '6px 10px', fontFamily: 'monospace', background: '#0a0a10', borderTop: '1px solid #1a1a2e' }}>
          ...and {profiles.length - 15} more rows
        </div>
      )}
    </div>
  )
}
