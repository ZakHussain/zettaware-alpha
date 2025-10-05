import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES, DEFAULT_THEME, ThemeConfig } from '../config/themes.config';

interface ThemeState {
  currentTheme: string;
  themes: Record<string, ThemeConfig>;
  customThemes: ThemeConfig[];
  isThemeSelectorOpen: boolean;
  isEditingTheme: boolean;
  editableTheme: ThemeConfig | null;
  isPanelFloating: boolean;
  panelPosition: { x: number; y: number };
  isDragging: boolean;
  
  // Actions
  setTheme: (themeId: string) => void;
  toggleThemeSelector: () => void;
  setThemeSelectorOpen: (open: boolean) => void;
  setIsEditingTheme: (editing: boolean) => void;
  setEditableTheme: (theme: ThemeConfig | null) => void;
  updateEditableThemeColor: (key: keyof ThemeConfig['colors'], value: string) => void;
  saveEditedTheme: () => void;
  saveNewCustomTheme: (name: string, description: string) => void;
  togglePanelFloating: () => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  setIsDragging: (dragging: boolean) => void;
  applyThemeToDOM: (themeIdOrConfig: string | ThemeConfig) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: DEFAULT_THEME,
      themes: THEMES,
      customThemes: [],
      isThemeSelectorOpen: false,
      isEditingTheme: false,
      editableTheme: null,
      isPanelFloating: false,
      panelPosition: { x: 20, y: 20 },
      isDragging: false,
      
      setTheme: (themeId: string) => {
        const allThemes = { ...THEMES, ...Object.fromEntries(get().customThemes.map(t => [t.id, t])) };
        const theme = allThemes[themeId];
        if (!theme) return;
        
        set({ 
          currentTheme: themeId,
          editableTheme: { ...theme }
        });
        get().applyThemeToDOM(themeId);
      },
      
      toggleThemeSelector: () => {
        set((state) => ({ isThemeSelectorOpen: !state.isThemeSelectorOpen }));
      },
      
      setThemeSelectorOpen: (open: boolean) => {
        set({ isThemeSelectorOpen: open });
      },
      
      setIsEditingTheme: (editing: boolean) => {
        set((state) => ({
          isEditingTheme: editing,
          editableTheme: editing ? { ...state.themes[state.currentTheme] } : null
        }));
      },
      
      setEditableTheme: (theme: ThemeConfig | null) => {
        set({ editableTheme: theme });
      },
      
      updateEditableThemeColor: (key: keyof ThemeConfig['colors'], value: string) => {
        set((state) => {
          if (!state.editableTheme) return state;
          return {
            editableTheme: {
              ...state.editableTheme,
              colors: {
                ...state.editableTheme.colors,
                [key]: value
              }
            }
          };
        });
      },
      
      saveEditedTheme: () => {
        const state = get();
        if (!state.editableTheme) return;
        
        const updatedThemes = { ...state.themes };
        const updatedCustomThemes = [...state.customThemes];
        
        // Check if it's a custom theme
        const customIndex = updatedCustomThemes.findIndex(t => t.id === state.currentTheme);
        if (customIndex !== -1) {
          updatedCustomThemes[customIndex] = state.editableTheme;
          set({ customThemes: updatedCustomThemes });
        } else {
          // It's a built-in theme, create a copy as custom
          const newTheme = {
            ...state.editableTheme,
            id: `${state.currentTheme}-custom-${Date.now()}`,
            name: `${state.editableTheme.name} (Edited)`,
            description: `Customized version of ${state.editableTheme.name}`
          };
          updatedCustomThemes.push(newTheme);
          set({ 
            customThemes: updatedCustomThemes,
            currentTheme: newTheme.id
          });
        }
        
        get().applyThemeToDOM(state.currentTheme);
      },
      
      saveNewCustomTheme: (name: string, description: string) => {
        const state = get();
        if (!state.editableTheme) return;
        
        const newTheme = {
          ...state.editableTheme,
          id: `custom-${Date.now()}`,
          name,
          description
        };
        
        set((prevState) => ({
          customThemes: [...prevState.customThemes, newTheme],
          currentTheme: newTheme.id
        }));
        
        get().applyThemeToDOM(newTheme.id);
      },
      
      togglePanelFloating: () => {
        set((state) => ({ isPanelFloating: !state.isPanelFloating }));
      },
      
      setPanelPosition: (position: { x: number; y: number }) => {
        set({ panelPosition: position });
      },
      
      setIsDragging: (dragging: boolean) => {
        set({ isDragging: dragging });
      },
      
      applyThemeToDOM: (themeIdOrConfig: string | ThemeConfig) => {
        let theme: ThemeConfig;
        
        if (typeof themeIdOrConfig === 'string') {
          // It's a theme ID, look it up
          const allThemes = { ...THEMES, ...Object.fromEntries(get().customThemes.map(t => [t.id, t])) };
          const foundTheme = allThemes[themeIdOrConfig];
          if (!foundTheme) return;
          theme = foundTheme;
        } else {
          // It's already a ThemeConfig object
          theme = themeIdOrConfig;
        }
        
        const root = document.documentElement;
        
        // Apply all theme colors as CSS custom properties
        Object.entries(theme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--theme-${key}`, value);
        });
        
        // Set theme data attribute for additional styling
        root.setAttribute('data-theme', theme.id);
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ 
        currentTheme: state.currentTheme,
        customThemes: state.customThemes,
        isPanelFloating: state.isPanelFloating,
        panelPosition: state.panelPosition
      }),
    }
  )
);

// Initialize theme on first load
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  store.applyThemeToDOM(store.currentTheme);
}