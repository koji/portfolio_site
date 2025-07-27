/**
 * Developer Configuration Panel for Enhanced Shader System
 * 
 * This component provides a comprehensive interface for developers to configure
 * and customize the enhanced portfolio shader system. It includes real-time
 * parameter adjustment, preset management, and configuration export/import.
 * 
 * @author Portfolio Shader System
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  ShaderConfigurationManager,
  SHADER_PRESETS,
  type CompleteShaderConfiguration,
  type ValidationResult,
} from '../utils/shaderConfiguration';

/**
 * Props for the shader configuration panel
 */
interface ShaderConfigurationPanelProps {
  /** Configuration manager instance */
  configManager: ShaderConfigurationManager;
  
  /** Whether the panel is visible */
  isVisible?: boolean;
  
  /** Callback when panel visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
  
  /** Whether to show advanced options */
  showAdvanced?: boolean;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Whether the panel is in development mode (shows all options) */
  developmentMode?: boolean;
}

/**
 * Developer-friendly shader configuration panel component
 */
export const ShaderConfigurationPanel: React.FC<ShaderConfigurationPanelProps> = ({
  configManager,
  isVisible = false,
  onVisibilityChange,
  showAdvanced = false,
  className = '',
  developmentMode = process.env.NODE_ENV === 'development',
}) => {
  const [config, setConfig] = useState<CompleteShaderConfiguration>(configManager.getConfig());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'particles' | 'interaction' | 'geometry' | 'colors' | 'performance'>('basic');
  const [exportedConfig, setExportedConfig] = useState<string>('');
  const [importConfig, setImportConfig] = useState<string>('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Subscribe to configuration changes
  useEffect(() => {
    const unsubscribe = configManager.addListener((newConfig) => {
      setConfig(newConfig);
      setValidationErrors([]);
      setValidationWarnings([]);
    });

    return unsubscribe;
  }, [configManager]);

  /**
   * Updates a configuration value with validation
   */
  const updateConfig = useCallback((updates: Partial<CompleteShaderConfiguration>) => {
    const result = configManager.updateConfig(updates);
    
    if (!result.isValid) {
      setValidationErrors(result.errors);
      setValidationWarnings(result.warnings);
    } else {
      setValidationErrors([]);
      setValidationWarnings(result.warnings);
    }
  }, [configManager]);

  /**
   * Applies a preset configuration
   */
  const applyPreset = useCallback((presetName: keyof typeof SHADER_PRESETS) => {
    const result = configManager.applyPreset(presetName);
    
    if (!result.isValid) {
      setValidationErrors(result.errors);
      setValidationWarnings(result.warnings);
    } else {
      setValidationErrors([]);
      setValidationWarnings(result.warnings);
    }
  }, [configManager]);

  /**
   * Resets configuration to defaults
   */
  const resetToDefaults = useCallback(() => {
    configManager.resetToDefaults();
    setValidationErrors([]);
    setValidationWarnings([]);
  }, [configManager]);

  /**
   * Exports current configuration
   */
  const exportConfiguration = useCallback(() => {
    const exported = configManager.exportConfig();
    setExportedConfig(exported);
    setShowExportModal(true);
  }, [configManager]);

  /**
   * Imports configuration from JSON
   */
  const importConfiguration = useCallback(() => {
    if (!importConfig.trim()) {
      setValidationErrors(['Import configuration cannot be empty']);
      return;
    }

    const result = configManager.importConfig(importConfig);
    
    if (!result.isValid) {
      setValidationErrors(result.errors);
      setValidationWarnings(result.warnings);
    } else {
      setValidationErrors([]);
      setValidationWarnings(result.warnings);
      setShowImportModal(false);
      setImportConfig('');
    }
  }, [configManager, importConfig]);

  /**
   * Copies text to clipboard
   */
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  // Don't render if not visible and not in development mode
  if (!isVisible && !developmentMode) {
    return null;
  }

  return (
    <div className={`shader-config-panel ${className}`} style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '80vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      borderRadius: '8px',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 9999,
      fontFamily: 'monospace',
      fontSize: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Shader Configuration</h3>
        {onVisibilityChange && (
          <button
            onClick={() => onVisibilityChange(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Validation Messages */}
      {validationErrors.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          border: '1px solid rgba(255, 0, 0, 0.5)',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '15px',
        }}>
          <strong>Validation Errors:</strong>
          <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validationWarnings.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 0, 0.2)',
          border: '1px solid rgba(255, 255, 0, 0.5)',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '15px',
        }}>
          <strong>Warnings:</strong>
          <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
            {validationWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preset Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Presets</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '10px' }}>
          {Object.keys(SHADER_PRESETS).map((presetName) => (
            <button
              key={presetName}
              onClick={() => applyPreset(presetName as keyof typeof SHADER_PRESETS)}
              style={{
                padding: '5px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              {presetName}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={resetToDefaults}
            style={{
              flex: 1,
              padding: '5px 10px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Reset to Defaults
          </button>
          <button
            onClick={exportConfiguration}
            style={{
              flex: 1,
              padding: '5px 10px',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
              border: '1px solid rgba(0, 255, 0, 0.5)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Export
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            style={{
              flex: 1,
              padding: '5px 10px',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              border: '1px solid rgba(0, 0, 255, 0.5)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Import
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          {(['basic', 'particles', 'interaction', 'geometry', 'colors', 'performance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '5px 8px',
                backgroundColor: activeTab === tab ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Controls */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {activeTab === 'basic' && (
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Basic Settings</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Intensity: {config.core.intensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.core.intensity}
                onChange={(e) => updateConfig({ core: { intensity: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Animation Speed: {config.core.animationSpeed.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={config.core.animationSpeed}
                onChange={(e) => updateConfig({ core: { animationSpeed: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Particle Count: {config.core.particleCount}
              </label>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={config.core.particleCount}
                onChange={(e) => updateConfig({ core: { particleCount: parseInt(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.core.interactionEnabled}
                  onChange={(e) => updateConfig({ core: { interactionEnabled: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Mouse Interaction
              </label>
            </div>

            {config.core.interactionEnabled && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                  Interaction Radius: {config.core.interactionRadius.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.core.interactionRadius}
                  onChange={(e) => updateConfig({ core: { interactionRadius: parseFloat(e.target.value) } })}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.core.respectMotionPreference}
                  onChange={(e) => updateConfig({ core: { respectMotionPreference: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Respect Motion Preferences
              </label>
            </div>
          </div>
        )}

        {activeTab === 'particles' && (
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Particle System</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Base Particle Count: {config.particles.baseParticleCount}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={config.particles.baseParticleCount}
                onChange={(e) => updateConfig({ particles: { baseParticleCount: parseInt(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Brownian Intensity: {config.particles.brownianIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={config.particles.brownianIntensity}
                onChange={(e) => updateConfig({ particles: { brownianIntensity: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Lifecycle Duration: {config.particles.lifecycleDuration.toFixed(1)}s
              </label>
              <input
                type="range"
                min="2"
                max="30"
                step="0.5"
                value={config.particles.lifecycleDuration}
                onChange={(e) => updateConfig({ particles: { lifecycleDuration: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.particles.enableDepthSimulation}
                  onChange={(e) => updateConfig({ particles: { enableDepthSimulation: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Depth Simulation
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.particles.enableGlowEffects}
                  onChange={(e) => updateConfig({ particles: { enableGlowEffects: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Glow Effects
              </label>
            </div>
          </div>
        )}

        {activeTab === 'interaction' && config.core.interactionEnabled && (
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Mouse Interaction</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Base Radius: {config.interaction.baseRadius.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.interaction.baseRadius}
                onChange={(e) => updateConfig({ interaction: { baseRadius: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Smoothing Factor: {config.interaction.smoothingFactor.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={config.interaction.smoothingFactor}
                onChange={(e) => updateConfig({ interaction: { smoothingFactor: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h5 style={{ margin: '0 0 5px 0', fontSize: '12px' }}>Interaction Zones</h5>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '10px' }}>
                  Repulsion Strength: {config.interaction.zones.repulsion.strength.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.interaction.zones.repulsion.strength}
                  onChange={(e) => updateConfig({ 
                    interaction: { 
                      zones: { 
                        ...config.interaction.zones,
                        repulsion: { 
                          ...config.interaction.zones.repulsion,
                          strength: parseFloat(e.target.value) 
                        }
                      }
                    }
                  })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '10px' }}>
                  Orbital Strength: {config.interaction.zones.orbital.strength.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.interaction.zones.orbital.strength}
                  onChange={(e) => updateConfig({ 
                    interaction: { 
                      zones: { 
                        ...config.interaction.zones,
                        orbital: { 
                          ...config.interaction.zones.orbital,
                          strength: parseFloat(e.target.value) 
                        }
                      }
                    }
                  })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '10px' }}>
                  Attraction Strength: {config.interaction.zones.attraction.strength.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.interaction.zones.attraction.strength}
                  onChange={(e) => updateConfig({ 
                    interaction: { 
                      zones: { 
                        ...config.interaction.zones,
                        attraction: { 
                          ...config.interaction.zones.attraction,
                          strength: parseFloat(e.target.value) 
                        }
                      }
                    }
                  })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.interaction.enableTrailEffects}
                  onChange={(e) => updateConfig({ interaction: { enableTrailEffects: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Trail Effects
              </label>
            </div>
          </div>
        )}

        {activeTab === 'geometry' && (
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Geometric Patterns</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.geometry.enableFlowingLines}
                  onChange={(e) => updateConfig({ geometry: { enableFlowingLines: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Flowing Lines
              </label>
            </div>

            {config.geometry.enableFlowingLines && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                  Lines Count: {config.geometry.flowingLinesCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="1"
                  value={config.geometry.flowingLinesCount}
                  onChange={(e) => updateConfig({ geometry: { flowingLinesCount: parseInt(e.target.value) } })}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.geometry.enableVoronoiPatterns}
                  onChange={(e) => updateConfig({ geometry: { enableVoronoiPatterns: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Voronoi Patterns
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.geometry.enableSpiralPatterns}
                  onChange={(e) => updateConfig({ geometry: { enableSpiralPatterns: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Spiral Patterns
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.geometry.enableFluidMesh}
                  onChange={(e) => updateConfig({ geometry: { enableFluidMesh: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Fluid Mesh
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.geometry.enableOrganicPatterns}
                  onChange={(e) => updateConfig({ geometry: { enableOrganicPatterns: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Organic Patterns
              </label>
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Colors & Theme</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Theme Transition: {config.core.themeTransition.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.core.themeTransition}
                onChange={(e) => updateConfig({ core: { themeTransition: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
                0 = Light Theme, 1 = Dark Theme
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Saturation Boost: {config.colors.saturationBoost.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={config.colors.saturationBoost}
                onChange={(e) => updateConfig({ colors: { saturationBoost: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Contrast Enhancement: {config.colors.contrastEnhancement.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={config.colors.contrastEnhancement}
                onChange={(e) => updateConfig({ colors: { contrastEnhancement: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Color Temperature: {config.colors.colorTemperature.toFixed(2)}
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={config.colors.colorTemperature}
                onChange={(e) => updateConfig({ colors: { colorTemperature: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
                -1 = Cool, 0 = Neutral, 1 = Warm
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Performance</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                Render Scale: {config.core.renderScale.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.4"
                max="1.2"
                step="0.1"
                value={config.core.renderScale}
                onChange={(e) => updateConfig({ core: { renderScale: parseFloat(e.target.value) } })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.performance.enableAutoQuality}
                  onChange={(e) => updateConfig({ performance: { enableAutoQuality: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Auto Quality Adjustment
              </label>
            </div>

            {config.performance.enableAutoQuality && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                  Target Frame Rate: {config.performance.targetFrameRate}fps
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={config.performance.targetFrameRate}
                  onChange={(e) => updateConfig({ performance: { targetFrameRate: parseInt(e.target.value) } })}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.performance.enableDeviceDetection}
                  onChange={(e) => updateConfig({ performance: { enableDeviceDetection: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Device Detection
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.performance.enablePerformanceMonitoring}
                  onChange={(e) => updateConfig({ performance: { enablePerformanceMonitoring: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Performance Monitoring
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            width: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: 'white' }}>Export Configuration</h4>
            <textarea
              value={exportedConfig}
              readOnly
              style={{
                width: '100%',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '10px',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                onClick={() => copyToClipboard(exportedConfig)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: 'rgba(0, 255, 0, 0.2)',
                  border: '1px solid rgba(0, 255, 0, 0.5)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            width: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: 'white' }}>Import Configuration</h4>
            <textarea
              value={importConfig}
              onChange={(e) => setImportConfig(e.target.value)}
              placeholder="Paste your configuration JSON here..."
              style={{
                width: '100%',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '10px',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                onClick={importConfiguration}
                disabled={!importConfig.trim()}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: importConfig.trim() ? 'rgba(0, 0, 255, 0.2)' : 'rgba(128, 128, 128, 0.2)',
                  border: `1px solid ${importConfig.trim() ? 'rgba(0, 0, 255, 0.5)' : 'rgba(128, 128, 128, 0.5)'}`,
                  borderRadius: '4px',
                  color: importConfig.trim() ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: importConfig.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportConfig('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Tools Section */}
      {developmentMode && (
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Developer Tools</h4>
          
          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={() => {
                const uniforms = configManager.getShaderUniforms();
                console.log('Current Shader Uniforms:', uniforms);
              }}
              style={{
                width: '100%',
                padding: '5px 10px',
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                border: '1px solid rgba(255, 165, 0, 0.5)',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
                marginBottom: '5px',
              }}
            >
              Log Shader Uniforms
            </button>
            
            <button
              onClick={() => {
                const validation = configManager.updateConfig({});
                console.log('Configuration Validation:', validation);
              }}
              style={{
                width: '100%',
                padding: '5px 10px',
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                border: '1px solid rgba(255, 165, 0, 0.5)',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
                marginBottom: '5px',
              }}
            >
              Validate Configuration
            </button>
          </div>
          
          <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Check browser console for detailed output
          </div>
        </div>
      )}

      {/* Configuration Info */}
      <div style={{ marginTop: '15px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
        <div>Particles: {config.core.particleCount}</div>
        <div>Render Scale: {(config.core.renderScale * 100).toFixed(0)}%</div>
        <div>Animation Speed: {config.core.animationSpeed.toFixed(1)}x</div>
        <div>Interaction: {config.core.interactionEnabled ? 'Enabled' : 'Disabled'}</div>
      </div>
    </div>
  );
};

/**
 * Hook for using shader configuration in components
 */
export const useShaderConfiguration = (initialConfig?: Partial<CompleteShaderConfiguration>) => {
  const [manager] = useState(() => new ShaderConfigurationManager(initialConfig));
  const [config, setConfig] = useState<CompleteShaderConfiguration>(manager.getConfig());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = manager.addListener((newConfig) => {
      setConfig(newConfig);
    });

    return unsubscribe;
  }, [manager]);

  const updateConfig = useCallback((updates: Partial<CompleteShaderConfiguration>) => {
    const result = manager.updateConfig(updates);
    setValidationErrors(result.errors);
    setValidationWarnings(result.warnings);
    return result;
  }, [manager]);

  const applyPreset = useCallback((presetName: keyof typeof SHADER_PRESETS) => {
    const result = manager.applyPreset(presetName);
    setValidationErrors(result.errors);
    setValidationWarnings(result.warnings);
    return result;
  }, [manager]);

  const resetToDefaults = useCallback(() => {
    manager.resetToDefaults();
    setValidationErrors([]);
    setValidationWarnings([]);
  }, [manager]);

  return {
    config,
    manager,
    validationErrors,
    validationWarnings,
    updateConfig,
    applyPreset,
    resetToDefaults,
    exportConfig: manager.exportConfig.bind(manager),
    importConfig: manager.importConfig.bind(manager),
    getShaderUniforms: manager.getShaderUniforms.bind(manager),
  };
};

/**
 * Context for sharing shader configuration across components
 */
export const ShaderConfigurationContext = React.createContext<{
  manager: ShaderConfigurationManager;
  config: CompleteShaderConfiguration;
  updateConfig: (updates: Partial<CompleteShaderConfiguration>) => ValidationResult;
} | null>(null);

/**
 * Provider component for shader configuration context
 */
export const ShaderConfigurationProvider: React.FC<{
  children: React.ReactNode;
  initialConfig?: Partial<CompleteShaderConfiguration>;
}> = ({ children, initialConfig }) => {
  const configHook = useShaderConfiguration(initialConfig);

  return (
    <ShaderConfigurationContext.Provider
      value={{
        manager: configHook.manager,
        config: configHook.config,
        updateConfig: configHook.updateConfig,
      }}
    >
      {children}
    </ShaderConfigurationContext.Provider>
  );
};

/**
 * Hook to use shader configuration context
 */
export const useShaderConfigurationContext = () => {
  const context = useContext(ShaderConfigurationContext);
  if (!context) {
    throw new Error('useShaderConfigurationContext must be used within a ShaderConfigurationProvider');
  }
  return context; '5px', fontSize: '11px' }}>
                  Target Frame Rate: {config.performance.targetFrameRate}fps
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={config.performance.targetFrameRate}
                  onChange={(e) => updateConfig({ performance: { targetFrameRate: parseInt(e.target.value) } })}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                <input
                  type="checkbox"
                  checked={config.performance.enablePerformanceMonitoring}
                  onChange={(e) => updateConfig({ performance: { enablePerformanceMonitoring: e.target.checked } })}
                  style={{ marginRight: '8px' }}
                />
                Enable Performance Monitoring
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: 'white' }}>Export Configuration</h4>
            <textarea
              value={exportedConfig}
              readOnly
              style={{
                width: '100%',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                padding: '10px',
                fontFamily: 'monospace',
                fontSize: '11px',
                resize: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                onClick={() => copyToClipboard(exportedConfig)}
                style={{
                  flex: 1,
                  padding: '8px 15px',
                  backgroundColor: 'rgba(0, 255, 0, 0.2)',
                  border: '1px solid rgba(0, 255, 0, 0.5)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  flex: 1,
                  padding: '8px 15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: 'white' }}>Import Configuration</h4>
            <textarea
              value={importConfig}
              onChange={(e) => setImportConfig(e.target.value)}
              placeholder="Paste your configuration JSON here..."
              style={{
                width: '100%',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                padding: '10px',
                fontFamily: 'monospace',
                fontSize: '11px',
                resize: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                onClick={importConfiguration}
                style={{
                  flex: 1,
                  padding: '8px 15px',
                  backgroundColor: 'rgba(0, 0, 255, 0.2)',
                  border: '1px solid rgba(0, 0, 255, 0.5)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportConfig('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShaderConfigurationPanel;