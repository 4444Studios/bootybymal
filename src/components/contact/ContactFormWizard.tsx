import { createPortal } from 'react-dom'
import {
  AGE_GROUPS,
  DAYS_PER_WEEK,
  FITNESS_GOALS,
  FITNESS_LEVELS,
  SERVICES,
  WEEKDAYS,
  type FormData,
  type FormErrors,
} from './formConfig'

function dayAbbrev(day: string): string {
  return day.slice(0, 3)
}

function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface StepMeta {
  title: string
  helper: string
}

export interface ContactFormWizardProps {
  formData: FormData
  errors: FormErrors
  currentStep: number
  totalSteps: number
  stepMeta: StepMeta
  progressPercent: number
  slideDirection: 'forward' | 'back'
  locationDetecting: boolean
  locationHint: string | null
  isSubmitting: boolean
  panelRef: React.RefObject<HTMLDivElement | null>
  firstFieldRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onLocationDetect: () => void
  onClearLocationHint: () => void
  onClose: () => void
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  onToggleDay: (day: string) => void
  onToggleService: (service: string) => void
  onToggleGoal: (goal: string) => void
  onSetCommitment: (value: string) => void
  onSetDaysPerWeek: (value: string) => void
  onSetAgeGroup: (value: string) => void
  onSetFitnessLevel: (value: string) => void
  submitError: string | null
}

export default function ContactFormWizard(props: ContactFormWizardProps) {
  const {
    formData,
    errors,
    currentStep,
    totalSteps,
    stepMeta,
    progressPercent,
    slideDirection,
    locationDetecting,
    locationHint,
    isSubmitting,
    panelRef,
    firstFieldRef,
    onChange,
    onLocationDetect,
    onClearLocationHint,
    onClose,
    onBack,
    onNext,
    onSubmit,
    onToggleDay,
    onToggleService,
    onToggleGoal,
    onSetCommitment,
    onSetDaysPerWeek,
    onSetAgeGroup,
    onSetFitnessLevel,
    submitError,
  } = props

  const panelClass = `form-wizard__panel form-wizard__panel--${slideDirection}`
  const isLastStep = currentStep === totalSteps

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="wizard-fullName">
                Full name <span className="required">*</span>
              </label>
              <input
                ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                type="text"
                id="wizard-fullName"
                name="fullName"
                placeholder="First and last name"
                value={formData.fullName}
                onChange={onChange}
                className={errors.fullName ? 'error' : ''}
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="wizard-location">
                Where are you located? <span className="required">*</span>
              </label>
              <input
                type="text"
                id="wizard-location"
                name="location"
                placeholder="City, State or Country"
                value={formData.location}
                onChange={e => {
                  onClearLocationHint()
                  onChange(e)
                }}
                className={errors.location ? 'error' : ''}
                autoComplete="address-level2"
                enterKeyHint="next"
              />
              <button
                type="button"
                className="location-detect-button"
                onClick={onLocationDetect}
                disabled={locationDetecting}
              >
                {locationDetecting ? 'Detecting…' : 'Use my current location'}
              </button>
              {locationHint && <span className="sub-label location-hint">{locationHint}</span>}
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="wizard-instagramPhone">
                IG / phone number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="wizard-instagramPhone"
                name="instagramPhone"
                placeholder="@username or phone"
                value={formData.instagramPhone}
                onChange={onChange}
                className={errors.instagramPhone ? 'error' : ''}
                autoComplete="tel"
                enterKeyHint="done"
              />
              {errors.instagramPhone && (
                <span className="error-message">{errors.instagramPhone}</span>
              )}
            </div>
            <div className="form-group">
              <p className="form-wizard__question">Age group</p>
              <div className="day-chips">
                {AGE_GROUPS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`day-chip${formData.ageGroup === opt ? ' day-chip--selected' : ''}`}
                    onClick={() => onSetAgeGroup(opt)}
                    aria-pressed={formData.ageGroup === opt}
                  >
                    {opt === 'other:' ? 'Other' : opt}
                  </button>
                ))}
              </div>
              {formData.ageGroup === 'other:' && (
                <input
                  type="text"
                  id="wizard-ageOther"
                  name="ageGroupOther"
                  placeholder="Your age group"
                  value={formData.ageGroupOther}
                  onChange={onChange}
                  style={{ marginTop: '0.75rem' }}
                />
              )}
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="form-group">
              <p className="form-wizard__question">
                Fitness goals <span className="required">*</span>
              </p>
              <div className="service-chips">
                {FITNESS_GOALS.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    className={`service-chip${formData.fitnessGoals.includes(goal) ? ' service-chip--selected' : ''}`}
                    onClick={() => onToggleGoal(goal)}
                    aria-pressed={formData.fitnessGoals.includes(goal)}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              {errors.fitnessGoals && <span className="error-message">{errors.fitnessGoals}</span>}
            </div>
            <div className="form-group">
              <p className="form-wizard__question">
                Current fitness level <span className="required">*</span>
              </p>
              <div className="choice-cards">
                {FITNESS_LEVELS.map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`choice-card${formData.fitnessLevel === level ? ' choice-card--selected' : ''}`}
                    onClick={() => onSetFitnessLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {errors.fitnessLevel && <span className="error-message">{errors.fitnessLevel}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="wizard-medical">
                Medical conditions or injuries? <span className="required">*</span>
              </label>
              <textarea
                id="wizard-medical"
                name="medicalConditions"
                placeholder="Share anything relevant, or write none"
                value={formData.medicalConditions}
                onChange={onChange}
                rows={3}
                className={errors.medicalConditions ? 'error' : ''}
              />
              {errors.medicalConditions && (
                <span className="error-message">{errors.medicalConditions}</span>
              )}
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="form-group">
              <p className="form-wizard__question">
                60-day minimum commitment to reach your goals. Ready?
                <span className="required"> *</span>
              </p>
              <div className="choice-cards">
                <button
                  type="button"
                  className={`choice-card${formData.commitment === 'yes' ? ' choice-card--selected' : ''}`}
                  onClick={() => onSetCommitment('yes')}
                >
                  Yes I&apos;m ready
                </button>
                <button
                  type="button"
                  className={`choice-card${formData.commitment === 'no' ? ' choice-card--selected' : ''}`}
                  onClick={() => onSetCommitment('no')}
                >
                  Not ready yet
                </button>
              </div>
              {errors.commitment && <span className="error-message">{errors.commitment}</span>}
            </div>
            <div className="form-group">
              <p className="form-wizard__question">
                Available training days <span className="required">*</span>
              </p>
              <div className="day-chips">
                {WEEKDAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`day-chip${formData.availableDays.includes(day) ? ' day-chip--selected' : ''}`}
                    onClick={() => onToggleDay(day)}
                    aria-pressed={formData.availableDays.includes(day)}
                  >
                    {dayAbbrev(day)}
                  </button>
                ))}
              </div>
              {errors.availableDays && (
                <span className="error-message">{errors.availableDays}</span>
              )}
            </div>
            <div className="form-group">
              <p className="form-wizard__question">
                How often per week? <span className="required">*</span>
              </p>
              <div className="segmented-control">
                {DAYS_PER_WEEK.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`segmented-control__btn${formData.daysPerWeek === opt ? ' segmented-control__btn--selected' : ''}`}
                    onClick={() => onSetDaysPerWeek(opt)}
                    aria-pressed={formData.daysPerWeek === opt}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.daysPerWeek && <span className="error-message">{errors.daysPerWeek}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="wizard-startDate">
                Start date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="wizard-startDate"
                name="startDate"
                value={formData.startDate}
                onChange={onChange}
                className={errors.startDate ? 'error' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>
          </>
        )
      case 4:
        return (
          <>
            <div className="form-group">
              <p className="form-wizard__question">
                Which training are you interested in? <span className="required">*</span>
              </p>
              <div className="service-chips">
                {SERVICES.map(service => (
                  <button
                    key={service}
                    type="button"
                    className={`service-chip${formData.services.includes(service) ? ' service-chip--selected' : ''}`}
                    onClick={() => onToggleService(service)}
                    aria-pressed={formData.services.includes(service)}
                  >
                    {service}
                  </button>
                ))}
              </div>
              {errors.services && <span className="error-message">{errors.services}</span>}
            </div>
          </>
        )
      default:
        return null
    }
  }

  const wizard = (
    <div
      className="form-wizard"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-wizard-title"
    >
      <header className="form-wizard__header">
        <button
          type="button"
          className="form-wizard__close"
          onClick={onClose}
          aria-label="Close application"
        >
          <IconClose />
        </button>
        <div className="form-wizard__progress-wrap">
          <div
            className="form-wizard__progress-track"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          >
            <div className="form-wizard__progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <p className="form-wizard__step-label">
          Step {currentStep} of {totalSteps} · {stepMeta.title}
        </p>
        <h2 id="form-wizard-title" className="form-wizard__title">
          {stepMeta.title}
        </h2>
        <p className="form-wizard__helper">{stepMeta.helper}</p>
      </header>

      <div className="form-wizard__body">
        <div
          ref={panelRef}
          className={panelClass}
          key={currentStep}
          onKeyDown={e => {
            if (e.key !== 'Enter' || e.shiftKey) return
            if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
            e.preventDefault()
            if (isLastStep) onSubmit()
            else onNext()
          }}
        >
          {renderStep()}
        </div>
      </div>

      <footer className="form-wizard__footer">
        {submitError && (
          <p className="form-wizard__submit-error" role="alert">
            {submitError}
          </p>
        )}
        {currentStep > 1 ? (
          <button
            type="button"
            className="form-wizard__btn form-wizard__btn--back"
            onClick={onBack}
            aria-label="Previous step"
          >
            <IconChevronLeft />
            Back
          </button>
        ) : (
          <span />
        )}
        {isLastStep ? (
          <button
            type="button"
            className="form-wizard__btn form-wizard__btn--primary"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending…' : 'Submit application'}
          </button>
        ) : (
          <button type="button" className="form-wizard__btn form-wizard__btn--primary" onClick={onNext}>
            Next
          </button>
        )}
      </footer>
    </div>
  )

  return createPortal(wizard, document.body)
}
