# Changelog

All notable changes to this project will be documented in this file.

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
