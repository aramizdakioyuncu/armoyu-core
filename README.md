# 🚀 ARMOYU Core Library

[![NPM Version](https://img.shields.io/npm/v/@armoyu/core?style=flat-square&color=blue)](https://www.npmjs.com/package/@armoyu/core)
[![Build Status](https://img.shields.io/github/actions/workflow/status/aramizdakioyuncu/armoyu-core/build.yml?style=flat-square)](https://github.com/aramizdakioyuncu/armoyu-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**ARMOYU Core** is the powerful, type-safe business logic layer designed for the ARMOYU ecosystem. It provides unified access to authentication, social interactions, community management, and real-time events across both legacy PHP backends and modern microservices.

---

## ✨ Features

- **🛡️ 100% Type Safe**: Built from the ground up with TypeScript for a rock-solid developer experience.
- **🧩 Modular Architecture**: 24+ specialized services covering everything from Chat to Staff management.
- **⚡ Real-time Ready**: Built-in support for SocketService for instant messaging and notifications.
- **🔄 Legacy Bridge**: Seamlessly communicates with legacy bot APIs with automated path resolution and response handling.
- **📦 Zero Bloat**: Minimal dependencies, focused purely on data and business logic.

---

## 📦 Installation

```bash
npm install @armoyu/core
```

---

## 🚀 Quick Start

Initialize the ARMOYU API and start interacting with the platform in seconds.

```typescript
import { ArmoyuApi } from '@armoyu/core';

// 1. Initialize the API
const api = new ArmoyuApi('YOUR_API_KEY', {
  baseUrl: 'https://api.aramizdakioyuncu.com'
});

// 2. Authenticate
const { user, session } = await api.auth.login('username', 'password');

// 3. Interact with services
const staff = await api.staff.getStaff(1, 'okul-temsilcileri');
console.log(`There are ${staff.length} school representatives! 🎓`);

// 4. Fetch geographical data
const countries = await api.locations.getCountries(1);

// 5. Payments & Billing
const invoices = await api.payments.getInvoices();

// 6. Social interactions
const feed = await api.social.getPosts({ category: 'sosyal' });
```

---

## 🏗️ Services Overview

| Service | Category | Description |
| :--- | :--- | :--- |
| **AuthService** | Identity | Login, Registration, and Session lifecycle. |
| **SocialService** | Community | Posts, Comments, Likes, and Shares. |
| **StoryService** | Social | Professional story/status management. |
| **ChatService** | Communication | Real-time messaging and chat history. |
| **UserService** | Profile | Global player profiles, Friendships, and Media. |
| **StaffService** | Management | Official team list and recruitment applications. |
| **LocationService** | Geography | Countries and Provinces/Cities lookups. |
| **PaymentService** | Billing | Invoices, Payments, and Financial records. |
| **PollService** | Community | Interactive surveys and voting management. |
| **BlockService** | Security | User blacklists and interaction restrictions. |
| **StationService** | Business | Hobby units, Menu/Equipment, and Locations. |
| **TeamService** | Content | Official sports and community teams. |
| **ProjectService** | Content | Development projects and scoreboards. |
| **BusinessService** | Economy | Workplace and school participation. |
| **EventService** | Esports | Tournaments, Matches, and Participations. |
| **ForumService** | Content | Community discussions and Category management. |
| **GroupService** | Social | Clan management, Invites, and Group settings. |
| **SupportService** | Meta | Platform tickets and User assistance. |
| **RuleService** | Legal | Platform guidelines and Automated rules. |
| **SocketService** | Infrastructure | WebSocket connection management. |

---

## 🎨 Architecture Standards

All services in this library adhere to a strict modernization standard (Audited v1.1.2+):
- Inheritance from `BaseService`.
- Standardized logging via `ArmoyuLogger`.
- Robust error handling via `handleResponse`.
- Full JSDoc documentation for all public methods.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Developed with ❤️ by the <b>ARMOYU Development Team</b>.<br/>
  "Aramızdaki Oyuncuyu Keşfet"
</p>
