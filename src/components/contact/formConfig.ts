export interface FormData {
  fullName: string
  location: string
  instagramPhone: string
  fitnessGoals: string[]
  daysPerWeek: string
  ageGroup: string
  ageGroupOther: string
  availableDays: string[]
  medicalConditions: string
  commitment: string
  services: string[]
  fitnessLevel: string
  startDate: string
}

export interface FormErrors {
  [key: string]: string
}

export const TOTAL_STEPS = 4

export const STEP_META = [
  { title: 'About you', helper: 'Tell Mal who you are' },
  { title: 'Your goals', helper: 'Help her understand your journey' },
  { title: 'Training plan', helper: 'Schedule and commitment' },
  { title: 'Services', helper: 'Almost done' },
] as const

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export const SERVICES = ['1 on 1', 'Online coaching', 'Group Training'] as const

export const FITNESS_GOALS = [
  'Weight loss',
  'Muscle gain',
  'Increased Endurance',
  'Overall Fitness',
] as const

export const DAYS_PER_WEEK = ['1-2 times', '3-4 times', '5 or more'] as const

export const AGE_GROUPS = ['Under 18', '18-24', '25-34', '35-44', 'other:'] as const

export const FITNESS_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

const FIELD_TO_WIZARD_STEP: Record<string, number> = {
  fullName: 1,
  location: 1,
  instagramPhone: 1,
  fitnessGoals: 2,
  fitnessLevel: 2,
  medicalConditions: 2,
  commitment: 3,
  availableDays: 3,
  daysPerWeek: 3,
  startDate: 3,
  services: 4,
}

export const EMPTY_FORM: FormData = {
  fullName: '',
  location: '',
  instagramPhone: '',
  fitnessGoals: [],
  daysPerWeek: '',
  ageGroup: '',
  ageGroupOther: '',
  availableDays: [],
  medicalConditions: '',
  commitment: '',
  services: [],
  fitnessLevel: '',
  startDate: '',
}

export function getDefaultStartDate(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilMonday = (8 - dayOfWeek) % 7 || 7
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + daysUntilMonday)
  return nextMonday.toISOString().split('T')[0]
}

export function hasFormContent(data: FormData): boolean {
  return Boolean(
    data.fullName ||
      data.instagramPhone ||
      data.location ||
      data.services.length > 0 ||
      data.availableDays.length > 0 ||
      data.fitnessGoals.length > 0
  )
}

export function getFirstInvalidWizardStep(fieldErrors: FormErrors): number | null {
  const steps = Object.keys(fieldErrors)
    .map(key => FIELD_TO_WIZARD_STEP[key])
    .filter((step): step is number => step != null)
  return steps.length > 0 ? Math.min(...steps) : null
}

function errorsForStep1(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.fullName.trim()) errors.fullName = 'Full name is required'
  if (!data.location.trim()) errors.location = 'Location is required'
  if (!data.instagramPhone.trim()) errors.instagramPhone = 'Instagram or phone is required'
  return errors
}

function errorsForStep2(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (data.fitnessGoals.length === 0) errors.fitnessGoals = 'Please select at least one goal'
  if (!data.fitnessLevel) errors.fitnessLevel = 'Please select your fitness level'
  if (!data.medicalConditions.trim()) {
    errors.medicalConditions = 'Please share any conditions, or write none'
  }
  return errors
}

function errorsForStep3(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.commitment) errors.commitment = 'Please confirm your commitment'
  if (data.availableDays.length === 0) {
    errors.availableDays = 'Please select at least one day'
  }
  if (!data.daysPerWeek) errors.daysPerWeek = 'Please select how often you plan to train'
  if (!data.startDate) errors.startDate = 'Please select a start date'
  return errors
}

function errorsForStep4(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (data.services.length === 0) errors.services = 'Please select at least one service'
  return errors
}

export function buildStepErrors(data: FormData, step: number): FormErrors {
  if (step === 1) return errorsForStep1(data)
  if (step === 2) return errorsForStep2(data)
  if (step === 3) return errorsForStep3(data)
  if (step === 4) return errorsForStep4(data)
  return {}
}

export function buildFormErrors(data: FormData): FormErrors {
  return {
    ...errorsForStep1(data),
    ...errorsForStep2(data),
    ...errorsForStep3(data),
    ...errorsForStep4(data),
  }
}
