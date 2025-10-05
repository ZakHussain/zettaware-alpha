export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    sidebar: string;
    sidebarBorder: string;
    sidebarText: string;
    sidebarTextSecondary: string;
    chatBg: string;
    chatUserBg: string;
    chatAssistantBg: string;
  };
}

export const THEMES: Record<string, ThemeConfig> = {
  'dark-default': {
    id: 'dark-default',
    name: 'Dark Mode',
    description: 'Professional dark theme for focused work',
    colors: {
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      secondary: '#6B7280',
      accent: '#10B981',
      background: '#111827',
      surface: '#1F2937',
      surfaceHover: '#374151',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      sidebar: '#111827',
      sidebarBorder: '#374151',
      sidebarText: '#F9FAFB',
      sidebarTextSecondary: '#9CA3AF',
      chatBg: '#F9FAFB',
      chatUserBg: '#3B82F6',
      chatAssistantBg: '#FFFFFF'
    }
  },
  'ocean-breeze': {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Calming blues and teals inspired by ocean waves',
    colors: {
      primary: '#0EA5E9',
      primaryHover: '#0284C7',
      secondary: '#64748B',
      accent: '#06B6D4',
      background: '#0F172A',
      surface: '#1E293B',
      surfaceHover: '#334155',
      text: '#F1F5F9',
      textSecondary: '#CBD5E1',
      border: '#334155',
      success: '#22D3EE',
      warning: '#F59E0B',
      error: '#F87171',
      sidebar: '#0C1A2E',
      sidebarBorder: '#1E3A5F',
      sidebarText: '#E2E8F0',
      sidebarTextSecondary: '#94A3B8',
      chatBg: '#F8FAFC',
      chatUserBg: '#0EA5E9',
      chatAssistantBg: '#FFFFFF'
    }
  },
  'sunset-glow': {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm oranges and purples like a beautiful sunset',
    colors: {
      primary: '#F97316',
      primaryHover: '#EA580C',
      secondary: '#A855F7',
      accent: '#EC4899',
      background: '#1C1917',
      surface: '#292524',
      surfaceHover: '#44403C',
      text: '#FEF7ED',
      textSecondary: '#D6D3D1',
      border: '#44403C',
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      sidebar: '#1A1416',
      sidebarBorder: '#44403C',
      sidebarText: '#FEF7ED',
      sidebarTextSecondary: '#A8A29E',
      chatBg: '#FFFBEB',
      chatUserBg: '#F97316',
      chatAssistantBg: '#FFFFFF'
    }
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural greens with earth tones for a grounded feel',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#6B7280',
      accent: '#84CC16',
      background: '#0F1F13',
      surface: '#1A2E20',
      surfaceHover: '#2D4A35',
      text: '#F0FDF4',
      textSecondary: '#D1FAE5',
      border: '#2D4A35',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      sidebar: '#0A1A0E',
      sidebarBorder: '#2D4A35',
      sidebarText: '#F0FDF4',
      sidebarTextSecondary: '#86EFAC',
      chatBg: '#F7FEF7',
      chatUserBg: '#059669',
      chatAssistantBg: '#FFFFFF'
    }
  },
  'hamilton-the-movie': {
    id: 'hamilton-the-movie',
    name: 'Hamilton: The Movie',
    description: 'Dramatic palette inspired by the Broadway hit and founding fathers era',
    colors: {
      primary: '#D4A574',
      primaryHover: '#C19B68',
      secondary: '#8B4B3C',
      accent: '#E6C79C',
      background: '#1A1611',
      surface: '#2D2419',
      surfaceHover: '#3D3025',
      text: '#F4F1E8',
      textSecondary: '#C9C3B8',
      border: '#4A3D2E',
      success: '#7C8471',
      warning: '#D4A574',
      error: '#A14A3A',
      sidebar: '#0F1419',
      sidebarBorder: '#2D2419',
      sidebarText: '#F4F1E8',
      sidebarTextSecondary: '#A68B5B',
      chatBg: '#F4F1E8',
      chatUserBg: '#8B4B3C',
      chatAssistantBg: '#FEFCF7'
    }
  },
  'pastel-dreams': {
    id: 'pastel-dreams',
    name: 'Pastel Dreams',
    description: 'Soft pastels for a gentle, creative atmosphere',
    colors: {
      primary: '#A855F7',
      primaryHover: '#9333EA',
      secondary: '#EC4899',
      accent: '#06B6D4',
      background: '#FEFCFF',
      surface: '#FFFFFF',
      surfaceHover: '#FAF5FF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      sidebar: '#F3E8FF',
      sidebarBorder: '#DDD6FE',
      sidebarText: '#581C87',
      sidebarTextSecondary: '#7C3AED',
      chatBg: '#FEFCFF',
      chatUserBg: '#A855F7',
      chatAssistantBg: '#FFFFFF'
    }
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum contrast for accessibility and clarity',
    colors: {
      primary: '#000000',
      primaryHover: '#1F2937',
      secondary: '#4B5563',
      accent: '#FFFFFF',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      surfaceHover: '#F3F4F6',
      text: '#000000',
      textSecondary: '#374151',
      border: '#000000',
      success: '#15803D',
      warning: '#A16207',
      error: '#B91C1C',
      sidebar: '#000000',
      sidebarBorder: '#374151',
      sidebarText: '#FFFFFF',
      sidebarTextSecondary: '#D1D5DB',
      chatBg: '#FFFFFF',
      chatUserBg: '#000000',
      chatAssistantBg: '#F9FAFB'
    }
  }
};

export const DEFAULT_THEME = 'dark-default';