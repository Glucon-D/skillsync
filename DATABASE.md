# SkillSync - Appwrite Database Schema

This document outlines the complete database structure for SkillSync using Appwrite as the backend.

---

## 📊 Database Overview

**Database Name:** `skillsync_db`

**Total Collections:** 3

**Note:** User authentication is handled by Appwrite Auth Service (no separate users collection needed)

**Static Data (No DB needed):**

- Career roles data (stored in `src/data/careerRoles.ts`)
- Job listings data (stored in `src/data/jobs.ts`)
- Skill pathways data (stored in `src/data/skills.ts`)
- Course catalog (fetched from external APIs like Udemy, Coursera)

**Database Collections:**

1. **userprofiles** - User profile information including assessment scores (references Appwrite Auth users)
2. **user_courses** - User's saved/bookmarked courses with full course details
3. **user_pathways** - User's learning pathway progress tracking

---

## 🗂️ Collection 1: `userprofiles`

**Purpose:** Extended user profile information including assessment scores (references Appwrite Auth users by userId)

**Collection ID:** `userprofiles`

### Attributes:

| Attribute               | Type          | Size  | Array | Required | Default | Description                                        |
| ----------------------- | ------------- | ----- | ----- | -------- | ------- | -------------------------------------------------- |
| `userId`                | string        | 36    | ❌ No  | ✅ Yes    | -       | Reference to Appwrite Auth user ID                 |
| `username`              | string        | 100   | ❌ No  | ❌ No     | ""      | Unique username for public portfolio               |
| `userImage`             | string        | 500   | ❌ No  | ❌ No     | ""      | Profile image URL from Appwrite Storage            |
| `location`              | string        | 200   | ❌ No  | ❌ No     | ""      | User's location                                    |
| `websiteUrl`            | string        | 500   | ❌ No  | ❌ No     | ""      | User's personal website URL                        |
| `bio`                   | string        | 1000  | ❌ No  | ❌ No     | ""      | User biography                                     |
| `education`             | string        | 10000 | ✅ Yes | ❌ No     | []      | Array of JSON strings (education objects)          |
| `skills`                | string        | 5000  | ✅ Yes | ❌ No     | []      | Array of JSON strings (skill objects)              |
| `experience`            | string        | 10000 | ✅ Yes | ❌ No     | []      | Array of JSON strings (experience objects)         |
| `socialLinks`           | string        | 2000  | ✅ Yes | ❌ No     | []      | Array of social media links                        |
| `projects`              | string        | 10000 | ✅ Yes | ❌ No     | []      | Array of JSON strings (project objects)            |
| `documents`             | string        | 2000  | ✅ Yes | ❌ No     | []      | Array of document URLs (certificates, transcripts) |
| `followersCount`        | integer       | -     | ❌ No  | ✅ Yes    | 0       | Count of followers                                 |
| `followingCount`        | integer       | -     | ❌ No  | ✅ Yes    | 0       | Count of users being followed                      |
| `followersList`         | string        | 100000| ❌ No  | ❌ No     | ""      | JSON string array of follower user IDs             |
| `followingList`         | string        | 100000| ❌ No  | ❌ No     | ""      | JSON string array of following user IDs            |
| `assessmentScores`      | string        | 500   | ❌ No  | ❌ No     | ""      | JSON string of assessment scores object            |
| `dominantType`          | string        | 50    | ❌ No  | ❌ No     | ""      | Dominant personality type from assessment          |
| `assessmentCompletedAt` | datetime      | -     | ❌ No  | ❌ No     | null    | When assessment was completed                      |
| `completionPercentage`  | integer       | -     | ❌ No  | ✅ Yes    | 0       | Profile completion (0-100)                         |
| `$createdAt`            | datetime      | -     | ❌ No  | ✅ Yes    | auto    | Creation timestamp                                 |
| `$updatedAt`            | datetime      | -     | ❌ No  | ✅ Yes    | auto    | Last update timestamp                              |

**IMPORTANT:** When creating attributes in Appwrite Console:
- For `education`, `skills`, `experience`, `socialLinks`, `projects`, `documents`: Select **String** type and check **"Array"** option
- Each array element will be a string (URLs for documents, JSON strings for others)
- For `assessmentScores`, `followersList`, `followingList`: Select **String** type (NOT array) - store as JSON string arrays
- For `followersCount`, `followingCount`, `completionPercentage`: Select **Integer** type

### JSON Structure for Nested Fields:

**education** (Array of objects):

```json
[
  {
    "school": "string (max 200)",
    "degree": "string (max 200)",
    "year": "string (max 10)",
    "gpa": "string (max 10, optional)"
  }
]
```

**skills** (Array of objects):

```json
[
  {
    "name": "string (max 100)",
    "level": "enum: beginner | intermediate | advanced"
  }
]
```

**experience** (Array of objects):

```json
[
  {
    "title": "string (max 200)",
    "description": "string (max 1000)",
    "duration": "string (max 50)",
    "techStack": ["string array"]
  }
]
```

**socialLinks** (Array of strings):

```json
[
  "https://github.com/username",
  "https://linkedin.com/in/username",
  "https://twitter.com/username"
]
```

**projects** (Array of objects):

```json
[
  {
    "name": "string (max 200)",
    "description": "string (max 1000)",
    "url": "string (max 500, optional)",
    "techStack": ["string array"],
    "image": "string (max 500, optional)"
  }
]
```

**documents** (Array of strings):

```json
[
  "https://cloud.appwrite.io/v1/storage/buckets/documents/files/file1/view",
  "https://cloud.appwrite.io/v1/storage/buckets/documents/files/file2/view"
]
```

**Note:** These are Appwrite Storage file URLs for certificates, grade sheets, transcripts, etc.

**assessmentScores** (Object):

```json
{
  "technical": 4.2,
  "creative": 3.8,
  "analytical": 4.5,
  "leadership": 3.2,
  "communication": 4.0
}
```

**Note:** Each score is a float between 0-5 representing the user's strength in that area.

### Indexes:

- `userId` (unique)
- `username` (key, unique)
- `completionPercentage`
- `dominantType`
- `assessmentCompletedAt`
- `followersCount`
- `followingCount`
- `$createdAt`

### Permissions:

- **Create:** Users (authenticated)
- **Read:** User (owner only)
- **Update:** User (owner only)
- **Delete:** User (owner only)

---

## 🗂️ Collection 2: `user_courses`

**Purpose:** User's saved courses with full course details (no separate courses catalog)

**Collection ID:** `user_courses`

### Attributes:

| Attribute    | Type     | Size | Required | Default | Description                      |
| ------------ | -------- | ---- | -------- | ------- | -------------------------------- |
| `userId`     | string   | 36   | Yes      | -       | Reference to Appwrite Auth user  |
| `courseId`   | string   | 100  | Yes      | -       | External course ID (from API)    |
| `title`      | string   | 300  | Yes      | -       | Course title                     |
| `platform`   | string   | 100  | Yes      | -       | Platform (Udemy, Coursera, etc.) |
| `difficulty` | string   | 20   | Yes      | -       | beginner/intermediate/advanced   |
| `price`      | float    | -    | Yes      | 0       | Price (0 for free)               |
| `rating`     | float    | -    | Yes      | 0       | Rating (0-5)                     |
| `thumbnail`  | string   | 500  | No       | ""      | Thumbnail URL                    |
| `url`        | string   | 1000 | Yes      | -       | Course URL                       |
| `category`   | string   | 100  | No       | ""      | Course category                  |
| `bookmarked` | boolean  | -    | Yes      | true    | Is bookmarked                    |
| `completed`  | boolean  | -    | Yes      | false   | Is completed                     |
| `$createdAt` | datetime | -    | Yes      | auto    | Creation timestamp               |
| `$updatedAt` | datetime | -    | Yes      | auto    | Last update timestamp            |

### Indexes:

- `userId`
- Compound: `userId + courseId` (unique)
- `platform`
- `difficulty`
- `category`
- `bookmarked`
- `completed`

### Permissions:

- **Create:** Users (authenticated)
- **Read:** User (owner only)
- **Update:** User (owner only)
- **Delete:** User (owner only)

---

## 🗂️ Collection 3: `user_pathways`

**Purpose:** Track user's learning pathway progress (skill completion tracking)

**Collection ID:** `user_pathways`

### Attributes:

| Attribute       | Type     | Size  | Required | Default | Description                                       |
| --------------- | -------- | ----- | -------- | ------- | ------------------------------------------------- |
| `userId`        | string   | 36    | Yes      | -       | Reference to Appwrite Auth user ID                |
| `pathwayId`     | string   | 50    | Yes      | -       | Pathway ID (from skills.ts e.g. sp1, sp2)         |
| `name`          | string   | 200   | Yes      | -       | Pathway name (denormalized for quick access)      |
| `category`      | string   | 100   | Yes      | -       | Category (e.g., Frontend Development)             |
| `level`         | string   | 20    | Yes      | -       | beginner/intermediate/advanced                    |
| `description`   | string   | 1000  | No       | ""      | Pathway description                               |
| `stepsData`     | string   | 10000 | No       | ""      | JSON stringified array of learning steps          |
| `resourcesData` | string   | 5000  | No       | ""      | JSON stringified array of resources               |
| `isCustom`      | boolean  | -     | No       | false   | True if user-requested skill                      |
| `completed`     | boolean  | -     | Yes      | false   | Is pathway completed                              |
| `completedAt`   | datetime | -     | No       | null    | When pathway was completed                        |
| `estimatedTime` | string   | 50    | No       | ""      | Estimated time to complete (e.g., "2 weeks")      |
| `$createdAt`    | datetime | -     | Yes      | auto    | Creation timestamp                                |
| `$updatedAt`    | datetime | -     | Yes      | auto    | Last update timestamp                             |

### JSON Structure for Nested Fields:

**stepsData** (Array of objects):

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": "boolean"
  }
]
```

**resourcesData** (Array of objects):

```json
[
  {
    "title": "string",
    "url": "string",
    "type": "string (e.g., video, article, course)"
  }
]
```

### Indexes:

- `userId`
- Compound: `userId + pathwayId` (unique)
- `category`
- `level`
- `completed`

### Permissions:

- **Create:** Users (authenticated)
- **Read:** User (owner only)
- **Update:** User (owner only)
- **Delete:** User (owner only)

---

## 🔐 Security & Permissions Summary

### Permission Levels:

1. **Public Read** - Courses, Careers (catalog data)
2. **User-Owned** - Profiles, Assessments, User_Courses, User_Careers
3. **Admin Only** - Create/Update/Delete catalog data

### Appwrite Permission Syntax:

```javascript
// User-owned documents
read: ["user:{userId}"];
write: ["user:{userId}"];

// Public read
read: ["any"];
write: ["role:admin"];
```

---

## 📈 Estimated Storage Requirements

| Collection    | Avg Doc Size | Est. Users | Total Storage |
| ------------- | ------------ | ---------- | ------------- |
| userprofiles  | 6 KB         | 10,000     | 60 MB         |
| user_courses  | 2 KB         | 50,000     | 100 MB        |
| user_pathways | 0.5 KB       | 30,000     | 15 MB         |
| **TOTAL**     | -            | -          | **~175 MB**   |

**Note:**

- User authentication data is stored separately in Appwrite Auth (not counted above)
- User documents (certificates, transcripts) stored in Appwrite Storage (not counted above)

**Static Data (No storage cost):**

- Career roles (15 roles in `careerRoles.ts`)
- Job listings (fetched from external APIs or static file)
- Course catalog (fetched from external APIs - stored per user in `user_courses`)

---

## 🚀 Migration from LocalStorage

Current data stored in localStorage needs to be migrated:

| LocalStorage Key               | Maps To Collection              |
| ------------------------------ | ------------------------------- |
| `skillsync_auth_user`          | Appwrite Auth (no collection)   |
| `skillsync_user_profile`       | `userprofiles`                  |
| `skillsync_assessment_results` | `userprofiles.assessmentScores` |
| `skillsync_bookmarked_courses` | `user_courses`                  |
| `skillsync_skill_progress`     | `user_pathways`                 |
| `skillsync_career_goals`       | Not needed (removed)            |

---

## 📝 Implementation Notes

### 1. **Relationships**

- Use document IDs for references (no foreign keys in NoSQL)
- Query related data using indexes
- Consider denormalization for frequently accessed data

### 2. **JSON Fields**

- Store arrays/objects as JSON strings
- Parse on client-side
- Validate structure before saving

### 3. **Indexes**

- Create indexes for all query fields
- Compound indexes for multi-field queries
- Monitor query performance

### 4. **Data Validation**

- Use Appwrite's built-in validation
- Add client-side validation (Zod schemas)
- Sanitize user input

### 5. **Scalability**

- Start with single database
- Consider sharding for 100k+ users
- Use Appwrite's built-in caching

---

## 🔄 Next Steps

1. **Create Database** in Appwrite Console
2. **Create Collections** with attributes as specified
3. **Set up Indexes** for query optimization
4. **Configure Permissions** for security
5. **Seed Initial Data** (courses, careers)
6. **Migrate LocalStorage** data to Appwrite
7. **Update Frontend** to use Appwrite Database SDK
8. **Test CRUD Operations** thoroughly

---

**Total Collections:** 3
**Total Attributes:** ~35
**Total Indexes:** ~12
**Estimated Setup Time:** 45 mins - 1 hour

**Key Design Decisions:**

- ✅ User authentication is handled by Appwrite Auth Service - no separate users collection needed!
- ✅ Career roles and job listings are static data - no database collections needed!
- ✅ Assessment scores are stored in userprofiles - no separate assessments collection needed!
- ✅ Course catalog is fetched from external APIs (Udemy, Coursera) - no separate courses collection needed!
- ✅ When user bookmarks a course, full course details are stored in user_courses collection!
- ✅ Skill pathways are static data - only user progress is stored in user_pathways collection!
- ✅ User documents (certificates, transcripts) stored in Appwrite Storage bucket!
