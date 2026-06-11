import { MAPBOX_TOKEN, FIRST_NAMES_M, FIRST_NAMES_F, LAST_NAMES, PHONE_PREFIX } from './data.js'

export const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
export const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
export const randDigits = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('')

export function genDOB(range) {
  if (!range || range === 'none') return null
  const [lo, hi] = range === '18-25' ? [18, 25] : range === '25-35' ? [25, 35] : range === '35-50' ? [35, 50] : [18, 60]
  const y = new Date().getFullYear() - randInt(lo, hi)
  return `${String(randInt(1, 28)).padStart(2, '0')}/${String(randInt(1, 12)).padStart(2, '0')}/${y}`
}

export function genPhone(country, separate) {
  const prefix = PHONE_PREFIX[country] || '+1'
  const num = randDigits(9)
  return separate ? { prefix, number: num } : prefix + num
}

export async function fetchAddresses(bbox, count) {
  const placeTypes = ['restaurant', 'cafe', 'hotel', 'school', 'hospital', 'pharmacy', 'supermarket', 'park', 'museum', 'church']
  const results = []
  let attempts = 0
  const [[lonMin, latMin], [lonMax, latMax]] = bbox

  while (results.length < count && attempts < count * 4) {
    attempts++
    const lon = lonMin + Math.random() * (lonMax - lonMin)
    const lat = latMin + Math.random() * (latMax - latMin)
    const type = rand(placeTypes)

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${type}.json?proximity=${lon.toFixed(4)},${lat.toFixed(4)}&types=address&limit=5&access_token=${MAPBOX_TOKEN}`
      )
      const data = await res.json()

      if (data.features?.length) {
        for (const f of data.features) {
          if (results.length >= count) break
          const houseNumber = f.address || String(randInt(1, 200))
          const street = f.text || ''
          const city = (f.context || []).find(c => c.id.startsWith('place'))?.text || ''
          const postcode = (f.context || []).find(c => c.id.startsWith('postcode'))?.text || ''
          if (street && city) results.push({ houseNumber, street, city, postcode })
        }
      }
    } catch (e) {
      // continue
    }

    if (results.length < count) await new Promise(r => setTimeout(r, 80))
  }

  return results.slice(0, count)
}

export function buildProfile({ tab, country, addresses, index, sepHouse, sepPrefix, dobRange }) {
  const gender = Math.random() < 0.5 ? 'M' : 'F'
  const firstName = rand(gender === 'M' ? FIRST_NAMES_M : FIRST_NAMES_F)
  const lastName = rand(LAST_NAMES)
  const phone = genPhone(country, sepPrefix)
  const dob = genDOB(dobRange)
  const addr = addresses[index] || { houseNumber: String(randInt(1, 200)), street: 'Unknown St', city: 'Unknown', postcode: '00000' }

  if (tab === 0) {
    const row = { firstName, lastName, gender }
    if (sepPrefix) { row.phonePrefix = phone.prefix; row.phoneNumber = phone.number }
    else row.phone = phone
    if (dob) row.dob = dob
    if (sepHouse) { row.houseNumber = addr.houseNumber; row.street = addr.street }
    else row.address = `${addr.houseNumber} ${addr.street}`
    row.city = addr.city
    row.postcode = addr.postcode
    return row
  }

  if (tab === 1) {
    const row = {}
    if (sepHouse) { row.houseNumber = addr.houseNumber; row.street = addr.street }
    else row.address = `${addr.houseNumber} ${addr.street}`
    row.city = addr.city
    row.postcode = addr.postcode
    return row
  }

  if (tab === 2) return { firstName, lastName, gender }

  if (sepPrefix) return { phonePrefix: phone.prefix, phoneNumber: phone.number }
  return { phone }
}

export function profilesToCSV(profiles) {
  if (!profiles.length) return ''
  const keys = Object.keys(profiles[0])
  const header = keys.join(',')
  const rows = profiles.map(p =>
    keys.map(k => `"${String(p[k] || '').replace(/"/g, '""')}"`).join(',')
  )
  return [header, ...rows].join('\n')
}

export function downloadCSV(profiles, filename) {
  const csv = profilesToCSV(profiles)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
