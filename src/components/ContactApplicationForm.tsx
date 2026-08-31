import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { reverseGeocode } from '../lib/reverseGeocode'
import { submitGoogleForm } from '../lib/googleForm'
import ContactFormDesktop from './contact/ContactFormDesktop'
import ContactFormWizard from './contact/ContactFormWizard'
import {
  EMPTY_FORM,
  STEP_META,
  TOTAL_STEPS,
  buildFormErrors,
  buildStepErrors,
  getDefaultStartDate,
  getFirstInvalidWizardStep,
  hasFormContent,
  type FormData,
  type FormErrors,
} from './contact/formConfig'

const STORAGE_KEY = 'bootyByMalForm'

interface SavedFormPayload {
  formData: FormData
  currentStep?: number
}

function parseSavedForm(raw: string): { formData: FormData; currentStep: number } | null {
  try {
    const parsed = JSON.parse(raw) as SavedFormPayload | FormData
    if (parsed && typeof parsed === 'object' && 'formData' in parsed && parsed.formData) {
      return {
        formData: { ...EMPTY_FORM, ...parsed.formData },
        currentStep: Math.min(Math.max(parsed.currentStep ?? 1, 1), TOTAL_STEPS),
      }
    }
    return {
      formData: { ...EMPTY_FORM, ...(parsed as FormData) },
      currentStep: 1,
    }
  } catch {
    return null
  }
}

export default function ContactApplicationForm() {
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationDetecting, setLocationDetecting] = useState(false)
  const [locationHint, setLocationHint] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [wizardOpen, setWizardOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [slideDirection, setSlideDirection] = useState<'forward' | 'back'>('forward')
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = parseSavedForm(saved)
      if (parsed) {
        setFormData(parsed.formData)
        if (parsed.currentStep > 1) setCurrentStep(parsed.currentStep)
        return
      }
      localStorage.removeItem(STORAGE_KEY)
    }
    setFormData(prev => ({ ...prev, startDate: getDefaultStartDate() }))
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasFormContent(formData)) {
        const payload: SavedFormPayload = {
          formData,
          ...(isMobile && wizardOpen ? { currentStep } : {}),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [formData, currentStep, isMobile, wizardOpen])

  useLayoutEffect(() => {
    if (!wizardOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [wizardOpen])

  useEffect(() => {
    if (!wizardOpen) return
    const t = window.setTimeout(() => {
      firstFieldRef.current?.focus()
      panelRef.current?.parentElement?.scrollTo({ top: 0 })
    }, 120)
    return () => window.clearTimeout(t)
  }, [wizardOpen, currentStep])

  useEffect(() => {
    if (!wizardOpen) return
    const vv = window.visualViewport
    if (!vv) return
    const syncKeyboard = () => {
      const overlap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      document.documentElement.style.setProperty('--bbm-kb', `${overlap}px`)
    }
    syncKeyboard()
    vv.addEventListener('resize', syncKeyboard)
    vv.addEventListener('scroll', syncKeyboard)
    return () => {
      vv.removeEventListener('resize', syncKeyboard)
      vv.removeEventListener('scroll', syncKeyboard)
      document.documentElement.style.removeProperty('--bbm-kb')
    }
  }, [wizardOpen])

  useEffect(() => {
    if (!isMobile || wizardOpen || submitted) return
    if (window.location.hash === '#contact') {
      setWizardOpen(true)
    }
    const onHashChange = () => {
      if (window.location.hash === '#contact') setWizardOpen(true)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [isMobile, wizardOpen, submitted])

  const fillLocationFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    const line = await reverseGeocode(latitude, longitude)
    setFormData(prev => ({ ...prev, location: line }))
    setLocationHint(null)
  }, [])

  const handleUseMyLocation = useCallback(() => {
    setLocationHint(null)

    if (!window.isSecureContext) {
      setLocationHint('Location detection needs HTTPS (or localhost). Please enter your city manually.')
      return
    }

    if (!navigator.geolocation) {
      setLocationHint('Location is not available in this browser. Please enter your city manually.')
      return
    }

    setLocationDetecting(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        void fillLocationFromCoordinates(latitude, longitude)
          .catch(() => {
            setLocationHint('Could not look up your city from GPS. Please type your location manually.')
          })
          .finally(() => setLocationDetecting(false))
      },
      err => {
        setLocationDetecting(false)
        if (err.code === err.PERMISSION_DENIED) {
          setLocationHint(
            'Location permission was denied. Enable it in browser settings or enter your city manually.'
          )
        } else if (err.code === err.TIMEOUT) {
          setLocationHint('Location timed out. Please try again or enter your city manually.')
        } else {
          setLocationHint('Location is unavailable. Please enter your city below (works without GPS).')
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    )
  }, [fillLocationFromCoordinates])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type } = target
    const checked = target.checked

    if (type === 'checkbox') {
      if (name === 'availableDays' || name === 'services' || name === 'fitnessGoals') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter((item: string) => item !== value),
        }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day],
    }))
    if (errors.availableDays) setErrors(prev => ({ ...prev, availableDays: '' }))
  }

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }))
    if (errors.services) setErrors(prev => ({ ...prev, services: '' }))
  }

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter(g => g !== goal)
        : [...prev.fitnessGoals, goal],
    }))
    if (errors.fitnessGoals) setErrors(prev => ({ ...prev, fitnessGoals: '' }))
  }

  const setCommitment = (value: string) => {
    setFormData(prev => ({ ...prev, commitment: value }))
    if (errors.commitment) setErrors(prev => ({ ...prev, commitment: '' }))
  }

  const setDaysPerWeek = (value: string) => {
    setFormData(prev => ({ ...prev, daysPerWeek: value }))
    if (errors.daysPerWeek) setErrors(prev => ({ ...prev, daysPerWeek: '' }))
  }

  const setAgeGroup = (value: string) => {
    setFormData(prev => ({
      ...prev,
      ageGroup: value,
      ageGroupOther: value === 'other:' ? prev.ageGroupOther : '',
    }))
  }

  const setFitnessLevel = (value: string) => {
    setFormData(prev => ({ ...prev, fitnessLevel: value }))
    if (errors.fitnessLevel) setErrors(prev => ({ ...prev, fitnessLevel: '' }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors = buildStepErrors(formData, step)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const applyValidationErrors = (newErrors: FormErrors): boolean => {
    setErrors(newErrors)
    const valid = Object.keys(newErrors).length === 0
    if (!valid && isMobile && wizardOpen) {
      const invalidStep = getFirstInvalidWizardStep(newErrors)
      if (invalidStep != null && invalidStep !== currentStep) {
        setSlideDirection(invalidStep < currentStep ? 'back' : 'forward')
        setCurrentStep(invalidStep)
      }
      setSubmitError('Please complete all required fields highlighted below.')
    } else if (!valid) {
      setSubmitError('Please complete all required fields.')
    } else {
      setSubmitError(null)
    }
    return valid
  }

  const scrollToFirstError = () => {
    requestAnimationFrame(() => {
      const root = isMobile && wizardOpen ? panelRef.current : document
      root?.querySelector('.error-message')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM, startDate: getDefaultStartDate() })
    setCurrentStep(1)
    setErrors({})
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSubmitError(null)

    if (!applyValidationErrors(buildFormErrors(formData))) {
      scrollToFirstError()
      return
    }

    setIsSubmitting(true)

    try {
      await submitGoogleForm(formData)
      setSubmitted(true)
      setSubmitError(null)
      setWizardOpen(false)
      localStorage.removeItem(STORAGE_KEY)

      window.setTimeout(() => {
        resetForm()
        setSubmitted(false)
      }, 3000)
    } catch (error: unknown) {
      console.error('Form submission error:', error)
      const detail = error instanceof Error ? error.message : 'Unknown error'
      setSubmitError(`Could not send your application (${detail}). Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWizardNext = () => {
    setSubmitError(null)
    if (!validateStep(currentStep)) {
      scrollToFirstError()
      return
    }
    if (currentStep < TOTAL_STEPS) {
      setSlideDirection('forward')
      setCurrentStep(s => s + 1)
    }
  }

  const handleWizardBack = () => {
    setSubmitError(null)
    if (currentStep > 1) {
      setSlideDirection('back')
      setCurrentStep(s => s - 1)
    }
  }

  const closeWizard = useCallback(() => {
    if (hasFormContent(formData)) {
      const ok = window.confirm('Discard your application progress?')
      if (!ok) return
    }
    setWizardOpen(false)
    setCurrentStep(1)
    setErrors({})
    setSubmitError(null)
  }, [formData])

  useEffect(() => {
    if (!wizardOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWizard()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [wizardOpen, closeWizard])

  const openWizard = () => {
    setSlideDirection('forward')
    setWizardOpen(true)
  }

  const progressPercent = (currentStep / TOTAL_STEPS) * 100

  if (submitted) {
    return (
      <div className="form-success">
        <h3>Thank you for applying!</h3>
        <p>Mal will review your form and be in touch soon.</p>
      </div>
    )
  }

  const sharedProps = {
    formData,
    errors,
    locationDetecting,
    locationHint,
    isSubmitting,
    submitError,
    onChange: handleInputChange,
    onLocationDetect: handleUseMyLocation,
    onClearLocationHint: () => setLocationHint(null),
    onSubmit: handleSubmit,
    onToggleGoal: toggleGoal,
    onSetAgeGroup: setAgeGroup,
    onSetFitnessLevel: setFitnessLevel,
  }

  return (
    <>
      {isMobile ? (
        <div className="contact-form-mobile-entry">
          <p className="contact-form-mobile-entry__text">
            Apply in a few quick steps — takes about 3 minutes.
          </p>
          <button type="button" className="contact-form-mobile-entry__cta" onClick={openWizard}>
            {hasFormContent(formData) ? 'Continue application' : 'Start application'}
          </button>
        </div>
      ) : (
        <ContactFormDesktop {...sharedProps} />
      )}
      {wizardOpen && isMobile && (
        <ContactFormWizard
          formData={formData}
          errors={errors}
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepMeta={STEP_META[currentStep - 1]}
          progressPercent={progressPercent}
          slideDirection={slideDirection}
          locationDetecting={locationDetecting}
          locationHint={locationHint}
          isSubmitting={isSubmitting}
          panelRef={panelRef}
          firstFieldRef={firstFieldRef}
          onChange={handleInputChange}
          onLocationDetect={handleUseMyLocation}
          onClearLocationHint={() => setLocationHint(null)}
          onClose={closeWizard}
          onBack={handleWizardBack}
          onNext={handleWizardNext}
          onSubmit={() => void handleSubmit()}
          onToggleDay={toggleDay}
          onToggleService={toggleService}
          onToggleGoal={toggleGoal}
          onSetCommitment={setCommitment}
          onSetDaysPerWeek={setDaysPerWeek}
          onSetAgeGroup={setAgeGroup}
          onSetFitnessLevel={setFitnessLevel}
          submitError={submitError}
        />
      )}
    </>
  )
}
