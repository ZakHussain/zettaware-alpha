# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZettaSource α is a multi-crew AI code generation system for microcontroller development, built with React + TypeScript + Vite. It provides specialized AI crews for Arduino, robotics, and general coding tasks with real-time health monitoring and dynamic theming.

## Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (no tests configured yet)
npx tsc --noEmit
```

## Architecture & Key Concepts

### State Management Pattern
- **Zustand stores** (`src/store/`): `app.store.ts` manages global app state, `theme.store.ts` handles theming
- **React Query**: Server state caching for API responses
- Components subscribe to specific store slices for reactive updates

### API Architecture (Contract-Based)
1. **Contracts** (`src/api/contracts/`): Define interfaces for crew and document operations
2. **Adapters** (`src/api/adapters/`): Implement contracts for external APIs (CrewAI, Docling)
3. **Services** (`src/api/services/`): Orchestrate operations between adapters and UI
4. **Flow**: Component → Hook → Service → Adapter → External API

### Multi-Crew System
- Three specialized crews defined in `src/config/crews.config.ts`:
  - **Arduino Crew**: Hardware analysis, component identification
  - **TankBot Crew**: Robotics code generation, path planning
  - **Coding Crew**: General code generation and optimization
- Each crew has multiple endpoints configured in `src/config/endpoints.config.ts`
- Health monitoring via `useCrewHealth` hook with 30-second intervals

### Component Organization
- **Layout components** (`src/components/layout/`): Sidebar, TabNavigation
- **Feature interfaces** (`src/components/`): chat/, documents/, schematics/, crews/
- **Shared UI** (`src/components/ui/`): ThemeSelector, ColorPicker
- Each major feature has dedicated interface component and supporting components

### Key Implementation Details

**Chat System** (`src/components/chat/`, `src/hooks/useCrewChat.ts`):
- Messages follow schema in `src/schemas/message.schema.ts`
- Markdown rendering with syntax highlighting
- Crew-specific routing based on selected crew and endpoint

**Document Processing** (`src/components/documents/`, `src/hooks/useDocumentProcessor.ts`):
- Drag-and-drop file upload via react-dropzone
- Document schema defined in `src/schemas/document.schema.ts`
- Processing tracked in app store's `processingDocuments` Set

**Dynamic Theming** (`src/config/themes.config.ts`, `src/store/theme.store.ts`):
- 7 built-in themes with CSS custom properties
- Custom theme creation with HSV color picker
- Theme persistence to localStorage

## Important Files & Locations

- **API Configuration**: `src/config/` - crews, endpoints, models, themes
- **State Management**: `src/store/` - app and theme stores
- **API Layer**: `src/api/` - contracts, adapters, services
- **Custom Hooks**: `src/hooks/` - crew chat, health monitoring, document processing
- **Type Schemas**: `src/schemas/` - document and message schemas

## Development Notes

- No test framework configured yet - consider adding when implementing tests
- ESLint not installed despite being in scripts - install dev dependencies if linting needed
- Uses Tailwind CSS for styling with utility classes
- All crew API endpoints expect POST requests with specific payloads defined in `endpoints.config.ts`