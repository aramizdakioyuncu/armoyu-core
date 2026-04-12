# Changelog

All notable changes to this project will be documented in this file.

## [1.1.7] - 2026-04-12

### ✨ Library Expansion
- **Dedicated Services**: Introduced 7 new specialized services: `PollService`, `BlockService`, `StationService`, `TeamService`, `StaffService`, `LocationService`, and `PaymentService`.
- **Payment & Billing**: Added `PaymentService` for automated invoice retrieval and payment processing.
- **Staff Management**: Implemented full recruitment workflow support (`api.staff.apply` and `api.staff.getApplications`).
- **Geographical Data**: Added `LocationService` for country and province/city lookups.
- **Interactive Features**: Added support for creating and answering polls via `PollService`.
- **Hobby & Business Units**: Added `StationService` to manage platform stations and detailed equipment/menu data.

### ➕ Models Added
- `Poll`, `PollOption`, `BlockedUser`, `PlatformStation`, `StationEquipment`, `PlatformTeam`, `TeamMember`, `StaffApplication`, `Country`, `Province`, `Invoice`.

## [1.1.6] - 2026-04-12

### ➕ Features
- **Professional Stories**: Extracted story management from `SocialService` into a dedicated `StoryService` (api.stories). Added support for viewing, liking, and viewer tracking.
- **Project Tracking**: Implemented `ProjectService` (api.projects) for managing development projects and scoreboards.

## [1.1.5] - 2026-04-12

### ➕ Features
- **Advanced Rankings**: Implemented `RankedUser` model and integrated XP/Popularity rankings into `UserService`.
- **Business Integration**: Enhanced `BusinessService` with workplace and school participation methods.

## [1.1.4] - 2026-04-12

### 🔧 Bug Fixes & Refactoring
- **Post Metrics Mapping**: Added top-level `likesCount` and `commentsCount` properties to the `Post` model.
- **API Synchronization**: Fully mapped `begenisay` (likes) and `yorumsay` (comments) from the legacy API to the `Post` model for better frontend compatibility.
- **Service Integration**: Consolidated `SocialService`, `ChatService`, and `BusinessService` into the main `ArmoyuApi` entry point.

## [1.1.3] - 2026-04-12

### 🔧 Bug Fixes & Refactoring
- **Critical Exports Fix**: Added missing `SocialService`, `ChatService`, `EventService`, `SearchService`, and `BusinessService` to the main `index.ts`.
- **Model Visibility**: Fixed missing `UserBadge` export in `models/index.ts`.
- **Namespace Resolution**: Ensured all 17 services are now correctly reachable from the library's root entry point.

## [1.1.2] - 2026-04-12

### ✨ Modernization & Audit
- **Full Service Audit**: Completed a systematic audit of all 17 service modules within the library.
- **Verification Tags**: Added `@checked` tags to all verified services, ensuring compliance with architectural standards.
- **Architectural Standardization**: Reinforced the use of `resolveBotPath` and `handleResponse` across all legacy interaction points.

### 🔧 Bug Fixes & Refactoring
- **Centralized Enums**: Moved `NotificationCategory`, `NotificationType`, `SearchCategory`, and `AuthEnums` to centralized files under `src/models/social/` to resolve duplicate export ambiguities.
- **Circular Dependency Resolution**: Fixed model ambiguity errors and circular imports identified during the final build process.
- **Index Optimization**: Cleaned up `src/index.ts` to provide a lean, unified entry point for all models and services.
- **Type Safety**: Refined return types for `ForumService`, `UserService`, and others to utilize specialized models and enums.

### 🧪 Testing
- **Enrichment Tests**: Verified `fromJSON` transformations for Users, News, Search Results, and Events.
- **API Tests**: Validated live authentication, profile fetching, and platform-wide rankings (XP/Popularity).

### ➕ Services Modernized
- `AuthService`, `BaseService`, `BlogService`, `BusinessService`, `ChatService`, `EventService`, `ForumService`, `GroupService`, `ManagementService`, `RuleService`, `SearchService`, `ShopService`, `SiteInformationService`, `SocialService`, `SocketService`, `SupportService`, `UserService`.

