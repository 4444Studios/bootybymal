import type { FormData } from '../components/contact/formConfig'

/** Public Google Form — NEW CLIENT FORM */
export const GOOGLE_FORM_VIEW =
  'https://docs.google.com/forms/d/e/1FAIpQLScdJWwmtroPL3rji7M31OcceNxawLVuw9J85lqHw6rVrjkH9A/viewform'

export const GOOGLE_FORM_RESPONSE =
  'https://docs.google.com/forms/d/e/1FAIpQLScdJWwmtroPL3rji7M31OcceNxawLVuw9J85lqHw6rVrjkH9A/formResponse'

/**
 * Entry IDs from FB_PUBLIC_LOAD_DATA_ on the public form.
 * If she edits questions, these IDs can change — remap from the viewform HTML.
 */
export const ENTRIES = {
  fullName: 'entry.1281280210',
  location: 'entry.2023895122',
  instagramPhone: 'entry.1940275329',
  fitnessGoals: 'entry.55007033',
  daysPerWeek: 'entry.1227219807',
  ageGroup: 'entry.326287636',
  availableDays: 'entry.597592158',
  medicalConditions: 'entry.1343729670',
  commitment: 'entry.372122659',
  services: 'entry.623767082',
  fitnessLevel: 'entry.440399610',
  startDate: '34512643',
} as const

export const COMMITMENT_YES = "Yes Im ready"
export const COMMITMENT_NO = "No, I'm not ready"

export function buildGoogleFormBody(data: FormData): URLSearchParams {
  const params = new URLSearchParams()
  params.set('fvv', '1')
  params.set('pageHistory', '0')
  params.set(ENTRIES.fullName, data.fullName.trim())
  params.set(ENTRIES.location, data.location.trim())
  params.set(ENTRIES.instagramPhone, data.instagramPhone.trim())
  params.set(ENTRIES.medicalConditions, data.medicalConditions.trim())
  params.set(ENTRIES.daysPerWeek, data.daysPerWeek)
  params.set(ENTRIES.fitnessLevel, data.fitnessLevel)
  params.set(
    ENTRIES.commitment,
    data.commitment === 'yes' ? COMMITMENT_YES : COMMITMENT_NO
  )

  for (const goal of data.fitnessGoals) {
    params.append(ENTRIES.fitnessGoals, goal)
  }
  for (const day of data.availableDays) {
    params.append(ENTRIES.availableDays, day)
  }
  for (const service of data.services) {
    params.append(ENTRIES.services, service)
  }

  if (data.ageGroup === 'other:') {
    params.append(ENTRIES.ageGroup, '__other_option__')
    params.set(`${ENTRIES.ageGroup}.other_option_response`, data.ageGroupOther.trim())
  } else if (data.ageGroup) {
    params.set(ENTRIES.ageGroup, data.ageGroup)
  }

  if (data.startDate) {
    const [year, month, day] = data.startDate.split('-')
    if (year && month && day) {
      params.set(`entry.${ENTRIES.startDate}_year`, year)
      params.set(`entry.${ENTRIES.startDate}_month`, String(Number(month)))
      params.set(`entry.${ENTRIES.startDate}_day`, String(Number(day)))
    }
  }

  return params
}

function submitViaIframe(body: URLSearchParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframeName = `bbm-gform-${Date.now()}`
    const iframe = document.createElement('iframe')
    iframe.name = iframeName
    iframe.title = 'Google Form submission'
    iframe.style.display = 'none'
    iframe.setAttribute('aria-hidden', 'true')

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = GOOGLE_FORM_RESPONSE
    form.target = iframeName
    form.style.display = 'none'
    form.acceptCharset = 'UTF-8'

    for (const [name, value] of body.entries()) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    let settled = false
    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      form.remove()
      iframe.remove()
      if (ok) resolve()
      else reject(new Error('Form submission timed out'))
    }

    iframe.addEventListener('load', () => finish(true))
    const timer = window.setTimeout(() => finish(true), 2200)

    document.body.appendChild(iframe)
    document.body.appendChild(form)
    try {
      form.submit()
    } catch (err) {
      finish(false)
      console.error(err)
    }
  })
}

async function submitViaProxy(body: URLSearchParams, proxyUrl: string): Promise<void> {
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(detail || `Proxy returned ${res.status}`)
  }
}

export async function submitGoogleForm(data: FormData): Promise<void> {
  const body = buildGoogleFormBody(data)
  const proxy = import.meta.env.VITE_FORM_PROXY_URL?.trim()
  if (proxy) {
    await submitViaProxy(body, proxy)
    return
  }
  await submitViaIframe(body)
}
