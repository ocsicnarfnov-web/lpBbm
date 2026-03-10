# Active Context: Broiler Breeder Management App

## Current State

**App Status**: ✅ Complete - Broiler Breeder Management System (BreederPro)

A full-featured farm management application built on Next.js 16 with SQLite database, JWT authentication, and pastel green UI theme.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] **Complete Broiler Breeder Management App**
  - [x] Authentication system (JWT, bcrypt, user roles)
  - [x] Login & Registration pages
  - [x] Account recovery page for deactivated users
  - [x] Dashboard with stats overview
  - [x] Farm Profile management with logo upload
  - [x] Flock Management (CRUD, transfers, age/livability calculations)
  - [x] Feed Management (categories, inventory, incoming, consumption)
  - [x] Mortality Management (mortality, spot cull, spent cull, missex)
  - [x] Egg Production Management (hatching/non-hatching, Excel export)
  - [x] Employee Management (CRUD, tenure calculation, photo upload)
  - [x] Settings page (admin user access management)
  - [x] Responsive sidebar navigation
  - [x] Pastel green color scheme

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | User accounts with roles (admin/manager/supervisor/worker) |
| `farm_profile` | Farm name, address, logo |
| `flocks` | Flock records with house number, breed, loading date |
| `flock_transfers` | Flock movement/transfer records |
| `feed_categories` | Feed type definitions |
| `feed_inventory` | Current stock levels per category |
| `feed_incoming` | Delivery records (bags → kg conversion) |
| `feed_consumption` | Daily consumption per flock |
| `mortality_records` | Mortality, culls, missex per flock |
| `egg_production` | Hatching and non-hatching egg records |
| `employees` | Employee records with tenure tracking |

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/login/` | Login page with JWT auth + recovery link | ✅ Ready |
| `src/app/register/` | Registration page | ✅ Ready |
| `src/app/recover/` | Account recovery page | ✅ Ready |
| `src/app/dashboard/` | Main dashboard layout | ✅ Ready |
| `src/app/dashboard/farm-profile/` | Farm profile management | ✅ Ready |
| `src/app/dashboard/flock/` | Flock management | ✅ Ready |
| `src/app/dashboard/feed/` | Feed management | ✅ Ready |
| `src/app/dashboard/mortality/` | Mortality tracking | ✅ Ready |
| `src/app/dashboard/egg-production/` | Egg production with Excel export | ✅ Ready |
| `src/app/dashboard/employees/` | Employee management | ✅ Ready |
| `src/app/dashboard/settings/` | Admin user access settings | ✅ Ready |
| `src/components/Sidebar.tsx` | Responsive sidebar navigation | ✅ Ready |
| `src/db/schema.ts` | Complete database schema | ✅ Ready |
| `src/lib/auth.ts` | JWT authentication utilities | ✅ Ready |

## User Access Levels

| Role | Access |
|------|--------|
| Admin | Full access including user management |
| Manager | Farm profile, flocks, feed, employees |
| Supervisor | Flocks, mortality, egg production |
| Worker | Record daily data (mortality, eggs) |

## Key Features

- **First user auto-becomes admin**
- **Account recovery** - deactivated users can reactivate with secret code (RECOVER-2024)
- **Age in weeks** calculated from loading date
- **Livability %** = (Ending Pop / Beginning Pop) × 100
- **Depletion Rate %** = (Total Mortality / Beginning Pop) × 100
- **Ending Inventory** = Beginning + Incoming - Consumed
- **1 bag = 50 kg** feed conversion
- **Tenure** calculated from hire date to resignation/today
- **Employee ID** auto-generated (EMP-YEAR-XXXX)
- **Excel export** for egg production records

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-08 | Complete Broiler Breeder Management App built |
| 2026-03-08 | Added account recovery page for deactivated users |
| 2026-03-10 | Fixed database driver - replaced @kilocode/app-builder-db with bun-sqlite for local SQLite support |
