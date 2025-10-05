import React, { useEffect, useRef, useState } from 'react';
import { Palette, Check, Sparkles, Edit3, Save, Plus, ArrowLeft, Move, Pin, PinOff, Pipette } from 'lucide-react';
import { useThemeStore } from '../../store/theme.store';
import { THEMES } from '../../config/themes.config';
import { ColorPicker } from './ColorPicker';
import clsx from 'clsx';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onPickerOpen: () => void;
}

function ColorInput({ label, value, onChange, onPickerOpen }: ColorInputProps) {
  return (
    <div className="flex items-center space-x-3 mb-3">
      <button
        onClick={onPickerOpen}
        className="w-8 h-8 rounded-lg border-2 border-white/20 flex-shrink-0 hover:scale-110 transition-transform cursor-pointer group relative"
        style={{ backgroundColor: value }}
        title="Open color picker"
      >
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center">
          <Pipette className="w-3 h-3 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
        </div>
      </button>
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function ThemeEditor() {
  const {
    editableTheme,
    updateEditableThemeColor,
    saveEditedTheme,
    saveNewCustomTheme,
    setIsEditingTheme,
    applyThemeToDOM
  } = useThemeStore();

  const [colorPickerState, setColorPickerState] = useState<{
    isOpen: boolean;
    colorKey: keyof typeof editableTheme.colors | null;
    currentColor: string;
  }>({
    isOpen: false,
    colorKey: null,
    currentColor: ''
  });

  const [originalColorValue, setOriginalColorValue] = useState<string | null>(null);
  // Apply theme changes in real-time
  useEffect(() => {
    if (editableTheme) {
      applyThemeToDOM(editableTheme);
    }
  }, [editableTheme, applyThemeToDOM]);

  if (!editableTheme) return null;

  const openColorPicker = (colorKey: keyof typeof editableTheme.colors) => {
    const currentColor = editableTheme.colors[colorKey];
    setOriginalColorValue(currentColor);
    setColorPickerState({
      isOpen: true,
      colorKey,
      currentColor
    });
  };

  const closeColorPicker = (shouldRevert = false) => {
    if (shouldRevert && originalColorValue && colorPickerState.colorKey) {
      updateEditableThemeColor(colorPickerState.colorKey, originalColorValue);
    }
    setOriginalColorValue(null);
    setColorPickerState({
      isOpen: false,
      colorKey: null,
      currentColor: ''
    });
  };

  const handleColorChange = (newColor: string) => {
    if (colorPickerState.colorKey) {
      updateEditableThemeColor(colorPickerState.colorKey, newColor);
    }
  };

  const handleColorPickerConfirm = () => {
    closeColorPicker(false); // Don't revert on confirm
  };

  const handleColorPickerCancel = () => {
    closeColorPicker(true); // Revert on cancel
  };
  const handleSaveNew = () => {
    const name = prompt('Enter theme name:');
    if (!name) return;
    
    const description = prompt('Enter theme description (optional):') || 'Custom theme';
    saveNewCustomTheme(name, description);
  };

  const colorFields = [
    { key: 'primary' as const, label: 'Primary Color' },
    { key: 'secondary' as const, label: 'Secondary Color' },
    { key: 'accent' as const, label: 'Accent Color' },
    { key: 'background' as const, label: 'Background' },
    { key: 'surface' as const, label: 'Surface' },
    { key: 'surfaceHover' as const, label: 'Surface Hover' },
    { key: 'text' as const, label: 'Text Color' },
    { key: 'textSecondary' as const, label: 'Secondary Text' },
    { key: 'border' as const, label: 'Border Color' },
    { key: 'success' as const, label: 'Success Color' },
    { key: 'warning' as const, label: 'Warning Color' },
    { key: 'error' as const, label: 'Error Color' },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Edit3 className="w-5 h-5 mr-2 text-blue-400" />
          Edit Theme: {editableTheme.name}
        </h3>
        <button
          onClick={() => setIsEditingTheme(false)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {colorFields.map(({ key, label }) => (
          <ColorInput
            key={key}
            label={label}
            value={editableTheme.colors[key]}
            onChange={(value) => updateEditableThemeColor(key, value)}
            onPickerOpen={() => openColorPicker(key)}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-700 mt-4">
        <div className="flex space-x-2">
          <button
            onClick={saveEditedTheme}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={handleSaveNew}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Save as New</span>
          </button>
        </div>
      </div>

      {/* Color Picker Modal */}
      {colorPickerState.isOpen && colorPickerState.colorKey && (
        <ColorPicker
          color={colorPickerState.currentColor}
          onChange={handleColorChange}
          onConfirm={handleColorPickerConfirm}
          onClose={handleColorPickerCancel}
          label={colorFields.find(f => f.key === colorPickerState.colorKey)?.label || 'Color'}
        />
      )}
    </div>
  );
}

export function ThemeSelector() {
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const {
    currentTheme,
    customThemes,
    isThemeSelectorOpen,
    isEditingTheme,
    isPanelFloating,
    panelPosition,
    isDragging,
    setTheme,
    toggleThemeSelector,
    setThemeSelectorOpen,
    setIsEditingTheme,
    togglePanelFloating,
    setPanelPosition,
    setIsDragging
  } = useThemeStore();
  
  const selectorRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setThemeSelectorOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setThemeSelectorOpen]);

  // Drag functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && isPanelFloating) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - 400; // Panel width
        const maxY = window.innerHeight - 500; // Panel height
        
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        
        setPanelPosition({ x: constrainedX, y: constrainedY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isPanelFloating, setPanelPosition, setIsDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (isPanelFloating) {
      const rect = dragRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsDragging(true);
      }
    }
  };

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId); // Keep the selector open after selection
  };

  const getThemePreviewColors = (themeId: string) => {
    const allThemes = { ...THEMES, ...Object.fromEntries(customThemes.map(t => [t.id, t])) };
    const theme = allThemes[themeId];
    if (!theme) return [];
    
    return [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.accent,
      theme.colors.surface,
      theme.colors.surfaceHover
    ];
  };

  return (
    <div 
      ref={selectorRef}
      className="relative"
    >
      {/* Theme Selector Button */}
      <button
        onClick={toggleThemeSelector}
        className={clsx(
          'group relative p-3 rounded-xl transition-all duration-300 ease-out',
          'hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ring-theme-primary focus:ring-offset-2 bg-theme-sidebar',
          isThemeSelectorOpen 
            ? 'bg-theme-primary shadow-lg' // Use primary color for active state
            : 'bg-theme-surface hover:bg-theme-surface-hover border border-theme-border hover:border-theme-border'
        )}
        title="Change theme"
        aria-label="Theme selector"
        aria-expanded={isThemeSelectorOpen}
      >
        <div className="relative">
          <Palette className={clsx(
            'w-5 h-5 transition-colors duration-300 text-theme-sidebar-text-secondary',
            isThemeSelectorOpen ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
          )} />
          
          {/* Animated sparkles */}
          <div className={clsx(
            'absolute -top-1 -right-1 transition-all duration-300',
            isThemeSelectorOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}> 
            <Sparkles className="w-3 h-3 text-theme-accent" />
          </div>
        </div>
        
        {/* Hover indicator */}
        <div className={clsx(
          'absolute inset-0 rounded-xl bg-theme-primary opacity-0',
          'group-hover:opacity-10 transition-opacity duration-300',
          !isThemeSelectorOpen && 'group-hover:opacity-10'
        )}></div>
      </button>

      {/* Theme Options Panel */}
      <div className={clsx( 
        isPanelFloating 
          ? 'fixed z-50 w-96 bg-theme-surface border border-theme-border rounded-2xl shadow-2xl select-none'
          : 'absolute bottom-full left-0 mb-2 w-80 bg-theme-surface border border-theme-border rounded-2xl shadow-2xl',
        'transform transition-all duration-300 ease-out origin-bottom-left',
        'backdrop-blur-sm bg-opacity-95',
        isDragging && 'cursor-grabbing',
        isThemeSelectorOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
      )}
      ref={dragRef}
      style={isPanelFloating ? { 
        left: `${panelPosition.x}px`, 
        top: `${panelPosition.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      } : undefined}>
        {/* Header */} 
        <div 
          className={clsx(
            "p-4 border-b border-gray-700",
            isPanelFloating && "cursor-grab active:cursor-grabbing"
          )}
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
                {isPanelFloating && (
                  <Move className="w-4 h-4 mr-2 text-gray-400" />
                )}
                <Palette className="w-5 h-5 mr-2 text-blue-400" />
                {isEditingTheme ? 'Theme Editor' : 'Choose Theme'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {isEditingTheme ? 'Customize colors to your liking' : 'Select a color palette that matches your mood'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditingTheme && (
                <button
                  onClick={() => setIsEditingTheme(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Edit current theme"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={togglePanelFloating}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title={isPanelFloating ? 'Dock panel' : 'Float panel'}
              >
                {isPanelFloating ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isEditingTheme ? (
          <ThemeEditor />
        ) : (
          <>
            {/* Theme Grid */}
            <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {/* Built-in themes */}
                {Object.entries(THEMES).map(([themeId, theme]) => {
                  const isSelected = currentTheme === themeId;
                  const previewColors = getThemePreviewColors(themeId);
                  
                  return (
                    <button
                      key={themeId}
                      onClick={() => handleThemeSelect(themeId)}
                      className={clsx(
                        'group relative p-4 rounded-xl text-left transition-all duration-300 focus:outline-none focus:ring-2 ring-theme-primary focus:ring-offset-2 bg-theme-sidebar',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        isSelected
                          ? 'bg-theme-primary shadow-lg border-transparent'
                          : 'bg-theme-surface-hover hover:bg-theme-surface border border-theme-border hover:border-theme-border'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1"> 
                          <h4 className={clsx(
                            'font-semibold text-sm mb-1',
                            isSelected ? 'text-white' : 'text-gray-200'
                          )}>
                            {theme.name}
                          </h4>
                          <p className={clsx(
                            'text-xs leading-relaxed text-theme-text-secondary',
                            isSelected ? 'text-blue-100' : 'text-gray-400'
                          )}>
                            {theme.description}
                          </p>
                        </div>
                        
                        {/* Selection indicator */}
                        <div className={clsx(
                          'ml-3 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                          'transition-all duration-300',
                          isSelected 
                            ? 'border-theme-text bg-theme-text'
                            : 'border-theme-text-secondary group-hover:border-theme-text'
                        )}>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>

                      {/* Color Preview */}
                      <div className="flex mt-3 space-x-2">
                        {previewColors.map((color, index) => (
                          <div
                            key={index}
                            className="w-5 h-3 rounded-full ring-1 ring-black ring-opacity-20"
                            style={{ backgroundColor: color }}
                            title={`Color ${index + 1}: ${color}`}
                          />
                        ))}
                      </div>

                      {/* Selection overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl bg-white bg-opacity-5 pointer-events-none" />
                      )}
                    </button>
                  );
                })}

                {/* Custom themes */}
                {customThemes.length > 0 && (
                  <>
                    <div className="border-t border-gray-700 my-2"></div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Custom Themes</p>
                    {customThemes.map((theme) => {
                      const isSelected = currentTheme === theme.id;
                      const previewColors = getThemePreviewColors(theme.id);
                      
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeSelect(theme.id)}
                          className={clsx(
                            'group relative p-4 rounded-xl text-left transition-all duration-300 focus:outline-none focus:ring-2 ring-theme-primary focus:ring-offset-2 bg-theme-sidebar',
                            'hover:scale-[1.02] active:scale-[0.98]',
                            isSelected
                              ? 'bg-theme-primary shadow-lg border-transparent'
                              : 'bg-theme-surface-hover hover:bg-theme-surface border border-theme-border hover:border-theme-border'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1"> 
                              <h4 className={clsx(
                                'font-semibold text-sm mb-1 flex items-center',
                                isSelected ? 'text-white' : 'text-gray-200'
                              )}>
                                {theme.name}
                                <Sparkles className="w-3 h-3 ml-1 text-yellow-400" />
                              </h4>
                              <p className={clsx(
                                'text-xs leading-relaxed text-theme-text-secondary',
                                isSelected ? 'text-blue-100' : 'text-gray-400'
                              )}>
                                {theme.description}
                              </p>
                            </div>
                            
                            {/* Selection indicator */}
                            <div className={clsx(
                              'ml-3 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                              'transition-all duration-300',
                              isSelected 
                                ? 'border-theme-text bg-theme-text'
                                : 'border-theme-text-secondary group-hover:border-theme-text'
                            )}>
                              {isSelected && (
                                <Check className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </div>

                          {/* Color Preview */}
                          <div className="flex mt-3 space-x-2">
                            {previewColors.map((color, index) => (
                              <div
                                key={index}
                                className="w-5 h-3 rounded-full ring-1 ring-black ring-opacity-20"
                                style={{ backgroundColor: color }}
                                title={`Color ${index + 1}: ${color}`}
                              />
                            ))}
                          </div>

                          {/* Selection overlay */}
                          {isSelected && (
                            <div className="absolute inset-0 rounded-xl bg-white bg-opacity-5 pointer-events-none" />
                          )}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-theme-border bg-theme-surface rounded-b-2xl">
              <p className="text-xs text-gray-400 text-center">
                Theme changes are applied instantly and saved automatically
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}