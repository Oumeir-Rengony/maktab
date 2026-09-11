export interface NavigationItem {
  label: string;
  href: string;
}

export interface BrandData {
  name: string;
  homeLabel: string;
}

export interface HeaderData {
  navigation: NavigationItem[];
  cta: NavigationItem;
  skipToContentLabel: string;
  mainNavigationLabel: string;
  mobileNavigationLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
}

export interface HeroData {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: NavigationItem;
  secondaryCta: NavigationItem;
  welcomeTitle: string;
  welcomeDescription: string;
  welcomeMarks: string[];
  lessonLabel: string;
  lessonTitle: string;
  lessonSteps: string;
  arabicWord: string;
  arabicTranslation: string;
  illustrationLabel: string;
}

export interface MotivationItem {
  title: string;
  description: string;
  icon: "shield" | "arch" | "community";
}

export interface MotivationData {
  eyebrow: string;
  title: string;
  description: string;
  items: MotivationItem[];
  quote: string;
  arabicQuote: string;
  quoteSource: string;
}

export interface Madrassah {
  name: string;
  location: string;
  address: string;
  personInCharge: string;
  phone?: string;
}

export interface PremisesData {
  eyebrow: string;
  title: string;
  description: string;
  tableHeaders: {
    name: string;
    location: string;
    address: string;
    personInCharge: string;
    contact: string;
  };
  moreTitle: string;
  moreDescription: string;
  viewAllLabel: string;
  directoryNote: string;
  dialog: {
    eyebrow: string;
    title: string;
    description: string;
    searchLabel: string;
    searchPlaceholder: string;
    locationFilterLabel: string;
    allLocationsLabel: string;
    closeLabel: string;
    emptyMessage: string;
    scrollHint: string;
    singularResult: string;
    pluralResult: string;
  };
  madrassahs: Madrassah[];
}

export interface FormOption {
  label: string;
  value: string;
}

export interface RegistrationData {
  eyebrow: string;
  title: string;
  description: string;
  helpTitle: string;
  helpText: string;
  helpPhone: string;
  requiredNote: string;
  errorMessage: string;
  submissionError: string;
  progressLabel: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
  fields: {
    course: string;
    coursePlaceholder: string;
    studentName: string;
    studentAge: string;
    studentAgePlaceholder: string;
    responsibleName: string;
    responsibleEmail: string;
    responsibleEmailPlaceholder: string;
    responsiblePhone: string;
    responsiblePhonePlaceholder: string;
    relationship: string;
    relationshipPlaceholder: string;
    residence: string;
    residencePlaceholder: string;
    attendedBefore: string;
    yes: string;
    no: string;
    previousMadrassah: string;
    studyDuration: string;
    studyDurationPlaceholder: string;
    quranProgress: string;
    quranProgressPlaceholder: string;
    surahProgress: string;
    surahProgressPlaceholder: string;
  };
  courseOptions: FormOption[];
  relationshipOptions: FormOption[];
  actions: {
    next: string;
    back: string;
    submit: string;
    submitting: string;
    reset: string;
  };
  success: {
    eyebrow: string;
    titlePrefix: string;
    description: string;
  };
}

export interface RegistrationFormState {
  course: string;
  studentName: string;
  studentAge: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  relationship: string;
  residence: string;
  attendedBefore: string;
  previousMadrassah: string;
  studyDuration: string;
  quranProgress: string;
  surahProgress: string;
}

export type RegistrationFieldName = keyof RegistrationFormState;

export type RegistrationApiResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: "INVALID_REGISTRATION" | "SUBMISSION_FAILED";
      invalidFields?: RegistrationFieldName[];
    };

export interface TeacherRegistrationFormState {
  fullName: string;
  gender: string;
  age: string;
  address: string;
  whatsappNumber: string;
  email: string;
  islamicStudiesQualifications: string;
  quranTajwidQualifications: string;
  currentlyTeaching: string;
  currentTeachingLocation: string;
  teachingExperience: string;
  ageGroups: string[];
  subjects: string[];
  otherSubjects: string;
  languages: string[];
  otherLanguage: string;
  availableDays: string[];
  preferredTeachingTimes: string;
  classesPerWeek: string;
  hasInternetAndDevice: string;
  comfortableOnline: string;
  teachingMotivation: string;
  additionalInformation: string;
  declarationConfirmed: boolean;
}

export type TeacherRegistrationFieldName =
  | "fullName"
  | "gender"
  | "age"
  | "address"
  | "whatsappNumber"
  | "email"
  | "islamicStudiesQualifications"
  | "currentlyTeaching"
  | "currentTeachingLocation"
  | "teachingExperience"
  | "ageGroups"
  | "subjects"
  | "languages"
  | "availableDays"
  | "classesPerWeek"
  | "hasInternetAndDevice"
  | "comfortableOnline"
  | "teachingMotivation"
  | "declarationConfirmed";

export type TeacherRegistrationApiResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: "INVALID_REGISTRATION" | "SUBMISSION_FAILED";
      invalidFields?: TeacherRegistrationFieldName[];
    };

export interface FooterData {
  tagline: string;
  navigation: NavigationItem[];
  navigationLabel: string;
  copyright: string;
  location: string;
}

export interface SiteData {
  metadata: {
    title: string;
    description: string;
    canonicalUrl: string;
    locale: string;
    logoAlt: string;
    keywords: string[];
  };
  brand: BrandData;
  header: HeaderData;
  hero: HeroData;
  motivation: MotivationData;
  premises: PremisesData;
  registration: RegistrationData;
  footer: FooterData;
}
