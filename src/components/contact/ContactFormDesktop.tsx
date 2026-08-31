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

interface Props {
  formData: FormData
  errors: FormErrors
  locationDetecting: boolean
  locationHint: string | null
  isSubmitting: boolean
  submitError: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onLocationDetect: () => void
  onClearLocationHint: () => void
  onSubmit: (e: React.FormEvent) => void
  onToggleGoal: (goal: string) => void
  onSetAgeGroup: (value: string) => void
  onSetFitnessLevel: (value: string) => void
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0]
}

export default function ContactFormDesktop({
  formData,
  errors,
  locationDetecting,
  locationHint,
  isSubmitting,
  submitError,
  onChange,
  onLocationDetect,
  onClearLocationHint,
  onSubmit,
  onToggleGoal,
  onSetAgeGroup,
  onSetFitnessLevel,
}: Props) {
  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <fieldset className="form-section">
        <legend>About you</legend>

        <div className="form-group">
          <label htmlFor="fullName">
            Full name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="First and last name"
            value={formData.fullName}
            onChange={onChange}
            className={errors.fullName ? 'error' : ''}
            autoComplete="name"
            autoCapitalize="words"
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">
              Location <span className="required">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, State or Country"
              value={formData.location}
              onChange={e => {
                onClearLocationHint()
                onChange(e)
              }}
              className={errors.location ? 'error' : ''}
              autoComplete="address-level2"
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
            <label htmlFor="instagramPhone">
              IG / phone <span className="required">*</span>
            </label>
            <input
              type="text"
              id="instagramPhone"
              name="instagramPhone"
              placeholder="@username or (555) 555-5555"
              value={formData.instagramPhone}
              onChange={onChange}
              className={errors.instagramPhone ? 'error' : ''}
              autoComplete="tel"
            />
            {errors.instagramPhone && (
              <span className="error-message">{errors.instagramPhone}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Age group</label>
          <div className="radio-group">
            {AGE_GROUPS.map(opt => (
              <label key={opt} className="radio-label">
                <input
                  type="radio"
                  name="ageGroup"
                  value={opt}
                  checked={formData.ageGroup === opt}
                  onChange={() => onSetAgeGroup(opt)}
                />
                <span>{opt === 'other:' ? 'Other' : opt}</span>
              </label>
            ))}
          </div>
          {formData.ageGroup === 'other:' && (
            <input
              type="text"
              id="ageGroupOther"
              name="ageGroupOther"
              placeholder="Your age group"
              value={formData.ageGroupOther}
              onChange={onChange}
            />
          )}
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Goals</legend>

        <div className="form-group">
          <label>
            Fitness goals <span className="required">*</span>
            <span className="sub-label">Select all that apply.</span>
          </label>
          <div className="checkbox-group">
            {FITNESS_GOALS.map(goal => (
              <label key={goal} className="checkbox-label">
                <input
                  type="checkbox"
                  name="fitnessGoals"
                  value={goal}
                  checked={formData.fitnessGoals.includes(goal)}
                  onChange={() => onToggleGoal(goal)}
                />
                <span>{goal}</span>
              </label>
            ))}
          </div>
          {errors.fitnessGoals && <span className="error-message">{errors.fitnessGoals}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Fitness level <span className="required">*</span>
            </label>
            <div className="radio-group">
              {FITNESS_LEVELS.map(level => (
                <label key={level} className="radio-label">
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value={level}
                    checked={formData.fitnessLevel === level}
                    onChange={() => onSetFitnessLevel(level)}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
            {errors.fitnessLevel && <span className="error-message">{errors.fitnessLevel}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="medicalConditions">
              Medical conditions or injuries <span className="required">*</span>
            </label>
            <textarea
              id="medicalConditions"
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
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Plan</legend>

        <div className="form-group">
          <label>
            Available training days <span className="required">*</span>
            <span className="sub-label">Select all that apply.</span>
          </label>
          <div className="checkbox-group">
            {WEEKDAYS.map(day => (
              <label key={day} className="checkbox-label">
                <input
                  type="checkbox"
                  name="availableDays"
                  value={day}
                  checked={formData.availableDays.includes(day)}
                  onChange={onChange}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
          {errors.availableDays && <span className="error-message">{errors.availableDays}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              How often per week? <span className="required">*</span>
            </label>
            <div className="radio-group">
              {DAYS_PER_WEEK.map(opt => (
                <label key={opt} className="radio-label">
                  <input
                    type="radio"
                    name="daysPerWeek"
                    value={opt}
                    checked={formData.daysPerWeek === opt}
                    onChange={onChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.daysPerWeek && <span className="error-message">{errors.daysPerWeek}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">
              Start date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={onChange}
              className={errors.startDate ? 'error' : ''}
              min={todayIso()}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>
            60-day minimum commitment. Ready? <span className="required">*</span>
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="commitment"
                value="yes"
                checked={formData.commitment === 'yes'}
                onChange={onChange}
              />
              <span>Yes I&apos;m ready</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="commitment"
                value="no"
                checked={formData.commitment === 'no'}
                onChange={onChange}
              />
              <span>No, I&apos;m not ready</span>
            </label>
          </div>
          {errors.commitment && <span className="error-message">{errors.commitment}</span>}
        </div>

        <div className="form-group">
          <label>
            Training type <span className="required">*</span>
            <span className="sub-label">Select all that apply.</span>
          </label>
          <div className="checkbox-group">
            {SERVICES.map(service => (
              <label key={service} className="checkbox-label">
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  checked={formData.services.includes(service)}
                  onChange={onChange}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
          {errors.services && <span className="error-message">{errors.services}</span>}
        </div>
      </fieldset>

      {submitError && (
        <p className="form-submit-error" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Submit Application'}
      </button>
    </form>
  )
}
