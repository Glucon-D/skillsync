# SkillSync - Product Requirements Document

## Project Overview
SkillSync is an AI-powered career path recommender that helps students discover personalized career paths through profile analysis, interest assessment, and intelligent recommendations.

Also make sure there is proper protected routes setup in here.

**Framework**: Next.js 16 (App Router)  
**Phase**: MVP - Core Features Only

---

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Zustand (state management)
- React Hook Form + Zod (form validation)
- Lucide React (icons)
- Recharts (data visualization)
- Local Storage (auth & database for Phase 1)

---

## Design System

### Colors (Subtle Orangish Theme)

**Light Mode:**
- Primary: `#FF8C42` (soft orange)
- Primary Hover: `#FF7629`
- Secondary: `#FFF4E6` (warm cream)
- Accent: `#FFB366` (light peach)
- Background: `#FAFAFA`
- Surface: `#FFFFFF`
- Text: `#2D3748`
- Text Muted: `#718096`
- Border: `#E2E8F0`

**Dark Mode:**
- Primary: `#FF8C42`
- Primary Hover: `#FFB366`
- Secondary: `#2D3748`
- Accent: `#FF7629`
- Background: `#1A202C`
- Surface: `#2D3748`
- Text: `#F7FAFC`
- Text Muted: `#A0AEC0`
- Border: `#4A5568`

### Typography
- Font: Inter
- Weights: 400 (body), 600-700 (headings)
- Scale: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px

### Design Principles
- Minimal and clean with ample white space
- Subtle orange accents, not overwhelming
- Professional and modern aesthetic
- Mobile-first responsive design
- Full dark/light mode support

---

## File Structure

```
skillsync/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── assessment/page.tsx
│   │   │   ├── pathways/page.tsx
│   │   │   ├── courses/page.tsx
│   │   │   ├── careers/page.tsx
│   │   │   └── layout.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── SkillsInput.tsx
│   │   │   └── ExperienceCard.tsx
│   │   ├── assessment/
│   │   │   ├── QuizCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ResultsChart.tsx
│   │   ├── pathways/
│   │   │   ├── SkillCard.tsx
│   │   │   ├── RoadmapTimeline.tsx
│   │   │   └── ProgressTracker.tsx
│   │   ├── courses/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseFilters.tsx
│   │   │   └── CourseGrid.tsx
│   │   ├── careers/
│   │   │   ├── CareerCard.tsx
│   │   │   ├── MatchScore.tsx
│   │   │   └── SkillsGap.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── WelcomeHero.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       └── modal.tsx
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── profileStore.ts
│   │   ├── assessmentStore.ts
│   │   ├── pathwaysStore.ts
│   │   ├── coursesStore.ts
│   │   └── careersStore.ts
│   │
│   ├── lib/
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── localStorage.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   │
│   └── data/
│       ├── quizQuestions.ts
│       ├── sampleCourses.ts
│       ├── careerRoles.ts
│       └── skills.ts
│
├── public/images/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Core Features

### 1. Authentication
- Email/password signup and login
- Form validation with error handling
- Session management via Zustand
- Protected routes
- Auto-redirect after authentication
- Store user data in localStorage

### 2. Onboarding Flow
- Multi-step wizard (6 steps)
- Welcome → Basic Info → Academic → Skills → Interests → Quick Assessment
- Progress indicator
- Data collection and storage
- Navigate to dashboard on completion

### 3. Student Profiling
- Personal information form
- Academic history (education, major, GPA)
- Skills with proficiency levels (beginner/intermediate/advanced)
- Experience and projects
- Profile completion percentage
- Edit and update functionality

### 4. Interest Assessment
- 15-20 question quiz
- Categories: Technical, Creative, Analytical, Leadership, Communication
- Multiple choice questions with progress tracking
- Calculate scores per category
- Visualize results with radar chart
- Display dominant personality type
- Store results in localStorage
- Retake option

### 5. Skill Pathways
- Display recommended skills based on assessment
- Categorize by level (Beginner → Intermediate → Advanced)
- Visual roadmap timeline
- Mark skills as completed
- Track progress percentage
- Show estimated learning time
- Link to related resources

### 6. Course Recommendations
- Display curated courses based on profile and goals
- Show platform (Coursera, Udemy, YouTube, etc.)
- Display difficulty, duration, price, rating
- Bookmark/save courses
- Filter by platform, difficulty, price
- Search functionality
- Use mock data for demo

### 7. Career Role Suggestions
- Display AI-matched career roles with match percentage
- Detailed role descriptions
- Required skills breakdown
- Skills gap visualization
- Salary range and growth potential
- "Set as goal" functionality
- Compare multiple roles
- Use mock data for demo

### 8. Dashboard
- Personalized welcome message with user name
- Statistics cards (courses bookmarked, skills learned, completion %)
- Quick action buttons (take assessment, browse courses, etc.)
- Recent activity feed
- Recommended next steps
- Profile completion nudge

---

## Component Guidelines

### File Header Standard
Every file must start with:
```typescript
/**
 * @file filename.tsx
 * @description Brief description of what this component/file does
 * @dependencies List key dependencies used (e.g., zustand, react-hook-form)
 */
```

### TypeScript Standards
- Strict mode enabled
- No `any` types
- Explicit return types for functions
- Proper interface definitions
- Use path alias `@/` for imports

### Component Structure
```typescript
'use client' // Only if needed

import statements

interface Props {
  // Props definition
}

export function ComponentName({ props }: Props) {
  // Logic
  
  return (
    // JSX
  )
}
```

### Zustand Store Pattern
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  // State properties
}

interface Actions {
  // Action methods
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // Initial state and actions
    }),
    { name: 'storage-key' }
  )
)
```

---

## Data Models

### User
```typescript
interface User {
  id: string
  name: string
  email: string
  createdAt: string
}
```

### Profile
```typescript
interface Profile {
  userId: string
  bio: string
  phone?: string
  education: Education[]
  skills: Skill[]
  experience: Experience[]
  completionPercentage: number
}

interface Education {
  school: string
  degree: string
  year: string
  gpa?: string
}

interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

interface Experience {
  title: string
  description: string
  duration: string
  techStack: string[]
}
```

### Assessment
```typescript
interface AssessmentResult {
  userId: string
  scores: {
    technical: number
    creative: number
    analytical: number
    leadership: number
    communication: number
  }
  dominantType: string
  completedAt: string
}
```

### Course
```typescript
interface Course {
  id: string
  title: string
  platform: string
  instructor: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  price: number | 'free'
  rating: number
  thumbnail: string
  url: string
}
```

### Career
```typescript
interface Career {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  salaryRange: string
  growthPotential: 'low' | 'medium' | 'high'
  matchPercentage?: number
}
```

---

## LocalStorage Keys

```typescript
export const STORAGE_KEYS = {
  AUTH_USER: 'auth_user',
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  ASSESSMENT_RESULTS: 'assessment_results',
  SKILL_PROGRESS: 'skill_progress',
  BOOKMARKED_COURSES: 'bookmarked_courses',
  CAREER_GOALS: 'career_goals',
  THEME: 'theme_preference',
}
```

---

## UI/UX Requirements

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Test all pages on mobile, tablet, desktop

### Theme Toggle
- Seamless dark/light mode switching
- Persist preference in localStorage
- Use Tailwind `dark:` utilities
- CSS variables in globals.css

### Forms
- Labels above inputs
- Inline error messages (red)
- Required field indicators (*)
- Focus states with primary color ring
- Disable submit during loading
- Success/error toast notifications

### Loading States
- Skeleton loaders for content
- Spinner for buttons during submission
- Loading indicators for async operations

### Animations
- Smooth transitions (150ms default)
- Hover effects on interactive elements
- Fade in/out for modals
- Slide animations where appropriate

### Accessibility
- Semantic HTML
- ARIA labels for icons
- Keyboard navigation (Tab, Enter, Escape)
- Focus visible states
- Color contrast WCAG AA (4.5:1 minimum)

---

## Routing & Navigation

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (requires authentication)
- `/onboarding` - First-time user flow
- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/assessment` - Interest assessment quiz
- `/pathways` - Skill pathways and roadmap
- `/courses` - Course recommendations
- `/careers` - Career suggestions

### Layout Structure
- `(auth)` layout: Centered, no navbar/sidebar
- `(dashboard)` layout: Navbar + Sidebar + main content area
- Protected route wrapper checks auth state

---

## Implementation Requirements

### Tailwind Configuration
- Configure custom colors from design system
- Add Inter font family
- Enable dark mode (class strategy)
- Configure content paths correctly

### Form Validation
- Use Zod schemas for all forms
- Integrate with React Hook Form
- Display validation errors inline
- Prevent submission with invalid data

### State Management
- One Zustand store per domain (auth, profile, assessment, etc.)
- Use persist middleware for localStorage
- Define clear actions and state shape
- No external state mutations

### Mock Data
- Create realistic mock data for:
  - Assessment quiz questions (15-20 questions)
  - Sample courses (20-30 courses)
  - Career roles (15-20 roles)
  - Skills taxonomy (50+ skills categorized)
- Store in `src/data/` folder

### Error Handling
- Try-catch for async operations
- User-friendly error messages
- Fallback UI for errors
- Toast notifications for actions

---

## Special Instructions

1. **File Headers**: Every file MUST have a header comment describing its purpose and dependencies

2. **Clean Code**: Minimal, readable, well-structured code with proper naming conventions

3. **Responsive**: All components must be responsive and work on mobile/tablet/desktop

4. **Theme**: Full dark mode support using Tailwind's dark mode utilities

5. **Type Safety**: Strict TypeScript with no `any` types

6. **Performance**: Use Server Components where possible, mark Client Components with 'use client'

7. **Consistency**: Follow established patterns across all similar components

8. **User Experience**: Smooth transitions, clear feedback, intuitive navigation

9. **Accessibility**: Follow WCAG AA guidelines for all interactive elements

10. **LocalStorage**: Handle localStorage safely (check for SSR, handle errors)

---

## Success Criteria

- User can signup/login successfully
- Complete onboarding flow without errors
- Take assessment and see results visualization
- View personalized skill pathways
- Browse and bookmark courses
- See career matches with percentages
- Dark/light mode works seamlessly
- Fully responsive on all screen sizes
- Clean, minimal, professional UI
- No console errors or warnings

---

**This PRD serves as the complete blueprint for implementing SkillSync Phase 1 MVP. All features, components, and technical decisions should align with this document.**