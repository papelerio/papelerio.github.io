/**
 * ImageCompressor.js - Librería Independiente y Reciclable de Compresión de Imágenes a Base64 
 */

(function (global) {
  'use strict';

  // Inyección de estilos CSS aislados para el modal de ImageCompressor
  const CSS_STYLES = `
    .ic-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 15, 29, 0.82);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease-in-out;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      color: #f1f5f9;
      box-sizing: border-box;
    }
    .ic-backdrop * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .ic-backdrop.ic-visible {
      opacity: 1;
    }
    .ic-modal {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      width: 94%;
      max-width: 940px;
      max-height: 94vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
      overflow: hidden;
      transform: scale(0.95);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .ic-backdrop.ic-visible .ic-modal {
      transform: scale(1);
    }
    
    /* Header */
    .ic-header {
      padding: 16px 24px;
      background: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ic-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ic-icon-badge {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .ic-title {
      font-size: 1.12rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .ic-subtitle {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .ic-close-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.2s;
    }
    .ic-close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border-color: rgba(239, 68, 68, 0.3);
    }

    /* Body Layout */
    .ic-body {
      display: grid;
      grid-template-columns: 1fr 380px;
      overflow: hidden;
      max-height: calc(94vh - 130px);
    }
    @media (max-width: 820px) {
      .ic-body {
        grid-template-columns: 1fr;
        overflow-y: auto;
      }
    }

    /* Preview Section - Pixelado y Adaptativo */
    .ic-preview-container {
      padding: 20px;
      background: #090d16;
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      justify-content: center;
      position: relative;
      user-select: none;
      min-height: 320px;
    }
    .ic-img-wrapper {
      position: relative;
      width: 100%;
      height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      overflow: hidden;
      background-image: 
        linear-gradient(45deg, #1e293b 25%, transparent 25%), 
        linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #1e293b 75%), 
        linear-gradient(-45deg, transparent 75%, #1e293b 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px;
    }
    .ic-preview-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: opacity 0.15s ease;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
    .ic-preview-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #38bdf8;
      backdrop-filter: blur(8px);
      z-index: 10;
    }

    /* Botón flotante para abrir Recortador */
    .ic-btn-crop-trigger {
      position: absolute;
      bottom: 16px;
      right: 16px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(96, 165, 250, 0.4);
      color: #60a5fa;
      padding: 8px 14px;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 10;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .ic-btn-crop-trigger:hover {
      background: #2563eb;
      color: #ffffff;
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.5);
    }

    .ic-loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      z-index: 20;
    }
    .ic-loading-overlay.ic-active {
      opacity: 1;
    }
    .ic-spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: ic-spin 0.8s linear infinite;
    }
    @keyframes ic-spin {
      to { transform: rotate(360deg); }
    }

    /* Comparison Tabs */
    .ic-view-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      padding: 3px;
      border-radius: 10px;
      gap: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .ic-toggle-btn {
      padding: 6px 14px;
      font-size: 0.8rem;
      font-weight: 600;
      border: none;
      background: transparent;
      color: #94a3b8;
      border-radius: 7px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ic-toggle-btn.ic-active {
      background: #3b82f6;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    }

    /* Controls Section */
    .ic-controls-container {
      padding: 20px 22px;
      background: #1e293b;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 18px;
      overflow-y: auto;
    }
    
    /* Stats Box */
    .ic-stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .ic-stat-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 8px 10px;
      border-radius: 12px;
    }
    .ic-stat-card-reset {
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }
    .ic-stat-card-reset:hover {
      background: rgba(59, 130, 246, 0.18);
      border-color: rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }
    .ic-stat-card-reset:active {
      transform: translateY(0) scale(0.97);
    }
    .ic-reset-badge {
      font-size: 0.65rem;
      color: #60a5fa;
      font-weight: 700;
      text-transform: none;
      letter-spacing: 0;
      background: rgba(96, 165, 250, 0.12);
      padding: 1px 6px;
      border-radius: 4px;
      border: 1px solid rgba(96, 165, 250, 0.2);
    }
    .ic-stat-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 2px;
    }
    .ic-stat-val {
      font-size: 0.9rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .ic-stat-val.ic-saved {
      color: #34d399;
    }
    .ic-stat-val.ic-saved-badge {
      display: inline-block;
      background: rgba(52, 211, 153, 0.15);
      border: 1px solid rgba(52, 211, 153, 0.3);
      padding: 1px 5px;
      border-radius: 6px;
      font-size: 0.72rem;
      margin-left: 2px;
    }

    /* Field Layout */
    .ic-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ic-field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ic-field-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #cbd5e1;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .ic-field-val {
      font-size: 0.82rem;
      font-weight: 700;
      color: #60a5fa;
      background: rgba(96, 165, 250, 0.1);
      padding: 2px 8px;
      border-radius: 6px;
    }

    /* Input numérico junto al slider */
    .ic-input-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ic-num-input {
      width: 78px;
      padding: 5px 8px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #38bdf8;
      font-size: 0.85rem;
      font-weight: 700;
      text-align: right;
      outline: none;
      transition: border-color 0.2s;
    }
    .ic-num-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    }
    .ic-input-unit {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }

    /* Toggle de Aspect Ratio (Palanca) */
    .ic-aspect-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px 12px;
      border-radius: 10px;
    }
    .ic-aspect-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: #cbd5e1;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .ic-toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 22px;
    }
    .ic-toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .ic-toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: #334155;
      transition: .25s;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .ic-toggle-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: #ffffff;
      transition: .25s;
      border-radius: 50%;
    }
    .ic-toggle-switch input:checked + .ic-toggle-slider {
      background-color: #3b82f6;
    }
    .ic-toggle-switch input:checked + .ic-toggle-slider:before {
      transform: translateX(22px);
    }

    /* Range Sliders */
    .ic-slider {
      -webkit-appearance: none;
      appearance: none;
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: #334155;
      outline: none;
      cursor: pointer;
    }
    .ic-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #60a5fa;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
      transition: transform 0.15s ease, background 0.15s ease;
    }
    .ic-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
      background: #93c5fd;
    }
    .ic-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #60a5fa;
      cursor: pointer;
      border: none;
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
    }

    /* Format Selector Buttons */
    .ic-format-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .ic-format-btn {
      padding: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .ic-format-btn.ic-active {
      background: rgba(96, 165, 250, 0.15);
      border-color: #60a5fa;
      color: #60a5fa;
    }

    /* Footer / Actions */
    .ic-footer {
      padding: 14px 24px;
      background: #0f172a;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }
    .ic-btn {
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .ic-btn-cancel {
      background: transparent;
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .ic-btn-cancel:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
    }
    .ic-btn-primary {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
    }
    .ic-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
      background: linear-gradient(135deg, #1d4ed8, #6d28d9);
    }
    .ic-btn-primary:active {
      transform: translateY(0);
    }

    /* -------------------------------------------------------------
     * SUB-MODAL: RECORTADOR DE IMAGEN ("Puente dentro de un Puente")
     * ------------------------------------------------------------- */
    .ic-crop-overlay {
      position: absolute;
      inset: 0;
      background: #0b0f19;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .ic-crop-overlay.ic-active {
      opacity: 1;
      pointer-events: auto;
    }
    .ic-crop-header {
      padding: 14px 20px;
      background: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ic-crop-title-text {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ic-crop-presets {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .ic-crop-preset-btn {
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ic-crop-preset-btn.ic-active {
      background: rgba(96, 165, 250, 0.2);
      border-color: #60a5fa;
      color: #60a5fa;
    }
    .ic-crop-stage {
      flex: 1;
      position: relative;
      background: #050811;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 16px;
      user-select: none;
    }
    .ic-crop-wrapper {
      position: relative;
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
    }
    .ic-crop-img {
      max-width: 100%;
      max-height: calc(85vh - 160px);
      display: block;
      pointer-events: none;
      image-rendering: pixelated;
    }
    /* Cuadro de Selección interactivo con sombras y agarraderas */
    .ic-crop-box {
      position: absolute;
      border: 2px solid #60a5fa;
      box-shadow: 0 0 0 9999px rgba(5, 8, 17, 0.75);
      box-sizing: border-box;
      cursor: move;
      touch-action: none;
    }
    .ic-crop-box::before, .ic-crop-box::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .ic-crop-box::before {
      border-top: 1px dashed rgba(255, 255, 255, 0.4);
      border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
      top: 33.33%;
      bottom: 33.33%;
    }
    .ic-crop-box::after {
      border-left: 1px dashed rgba(255, 255, 255, 0.4);
      border-right: 1px dashed rgba(255, 255, 255, 0.4);
      left: 33.33%;
      right: 33.33%;
    }
    .ic-crop-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #ffffff;
      border: 2px solid #3b82f6;
      border-radius: 3px;
      z-index: 10;
    }
    .ic-crop-handle.nw { top: -6px; left: -6px; cursor: nwse-resize; }
    .ic-crop-handle.ne { top: -6px; right: -6px; cursor: nesw-resize; }
    .ic-crop-handle.sw { bottom: -6px; left: -6px; cursor: nesw-resize; }
    .ic-crop-handle.se { bottom: -6px; right: -6px; cursor: nwse-resize; }

    .ic-crop-dim-badge {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #38bdf8;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      pointer-events: none;
      z-index: 20;
    }
    .ic-crop-footer {
      padding: 14px 20px;
      background: #0f172a;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }
  `;

  class ImageCompressor {
    static injectCSS() {
      if (document.getElementById('ic-styles')) return;
      const styleEl = document.createElement('style');
      styleEl.id = 'ic-styles';
      styleEl.textContent = CSS_STYLES;
      document.head.appendChild(styleEl);
    }

    /**
     * Formatea bytes a KB o MB legibles.
     */
    static formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Abre el modal interactivo de compresión para un archivo de imagen.
     * @param {File|Blob|string} fileInput - Archivo de imagen o dataURL original.
     * @param {Object} options - Configuración inicial opcional.
     * @returns {Promise<Object>} Promesa que resuelve con los datos procesados en Base64.
     */
    static open(fileInput, options = {}) {
      this.injectCSS();

      return new Promise((resolve, reject) => {
        let file = fileInput;
        if (fileInput instanceof HTMLInputElement) {
          if (!fileInput.files || fileInput.files.length === 0) {
            reject(new Error('No se seleccionó ningún archivo de imagen.'));
            return;
          }
          file = fileInput.files[0];
        }

        if (!(file instanceof File) && !(file instanceof Blob) && typeof file !== 'string') {
          reject(new Error('Entrada inválida. Debe ser un objeto File, Blob o Data URL.'));
          return;
        }

        const fileName = file.name || 'imagen_optimizada';
        const reader = new FileReader();

        const processLoadedData = (dataUrl, originalSizeBytes) => {
          const img = new Image();
          img.onload = () => {
            const origW = img.naturalWidth;
            const origH = img.naturalHeight;
            const initialScale = options.scale || 0.8; // 80% inicial por defecto

            const state = {
              masterImage: img,              // Imagen física original cargada
              masterDataUrl: dataUrl,         // Master dataURL
              masterWidth: origW,
              masterHeight: origH,
              originalImage: img,            // Imagen activa (puede ser recortada)
              originalDataUrl: dataUrl,
              originalSizeBytes: originalSizeBytes || Math.round(dataUrl.length * 0.75),
              originalWidth: origW,
              originalHeight: origH,
              aspectRatio: origW / origH,
              lockAspectRatio: options.lockAspectRatio !== undefined ? options.lockAspectRatio : true, // Activado por defecto
              targetWidth: options.width || Math.max(1, Math.round(origW * initialScale)),
              targetHeight: options.height || Math.max(1, Math.round(origH * initialScale)),
              quality: options.quality || 0.75, // 75%
              format: options.format || 'image/jpeg',
              activeTab: 'compressed', // 'original' | 'compressed'
              compressedDataUrl: '',
              compressedSizeBytes: 0,
              compressedWidth: 0,
              compressedHeight: 0,
              fileName: fileName
            };

            const ui = ImageCompressor.createModalUI(state, resolve, reject);
            ImageCompressor.updateCompression(state, ui);
          };
          img.onerror = () => reject(new Error('No se pudo cargar la imagen para compresión.'));
          img.src = dataUrl;
        };

        if (typeof file === 'string') {
          processLoadedData(file, Math.round(file.length * 0.75));
        } else {
          reader.onload = (e) => processLoadedData(e.target.result, file.size);
          reader.onerror = () => reject(new Error('Error al leer el archivo.'));
          reader.readAsDataURL(file);
        }
      });
    }

    /**
     * Realiza la compresión directa mediante Canvas y genera el Data URL Base64.
     * Renderiza en modo PIXELADO (imageSmoothingEnabled = false) sin suavizado.
     */
    static compressCanvas(img, quality, targetWidth, targetHeight, format) {
      const canvas = document.createElement('canvas');
      const w = Math.max(1, Math.round(targetWidth));
      const h = Math.max(1, Math.round(targetHeight));

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      // Desactivar suavizado para efecto pixelado puro
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, w, h);

      const base64 = canvas.toDataURL(format, quality);
      // Estimar tamaño en bytes del base64 sin el prefijo
      const base64Clean = base64.split(',')[1] || '';
      const sizeBytes = Math.round(base64Clean.length * 0.75);

      return {
        base64,
        width: w,
        height: h,
        sizeBytes
      };
    }

    /**
     * Compresión directa por código sin abrir interfaz gráfica.
     */
    static async compress(file, options = {}) {
      return new Promise((resolve, reject) => {
        const quality = options.quality !== undefined ? options.quality : 0.75;
        const format = options.format || 'image/jpeg';

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const origW = img.naturalWidth;
            const origH = img.naturalHeight;
            const targetW = options.width || (options.scale ? Math.round(origW * options.scale) : Math.round(origW * 0.8));
            const targetH = options.height || (options.scale ? Math.round(origH * options.scale) : Math.round(origH * 0.8));

            const res = ImageCompressor.compressCanvas(img, quality, targetW, targetH, format);
            const originalSize = file.size || Math.round(e.target.result.length * 0.75);
            const savingsPercent = Math.max(0, Math.round(((originalSize - res.sizeBytes) / originalSize) * 100));

            resolve({
              base64: res.base64,
              originalSize: originalSize,
              compressedSize: res.sizeBytes,
              formattedOriginalSize: ImageCompressor.formatBytes(originalSize),
              formattedCompressedSize: ImageCompressor.formatBytes(res.sizeBytes),
              savingsPercent: savingsPercent,
              width: res.width,
              height: res.height,
              quality: quality,
              format: format
            });
          };
          img.onerror = () => reject(new Error('Error al decodificar la imagen.'));
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    /**
     * Crea los elementos HTML del Modal interactivo.
     */
    static createModalUI(state, resolve, reject) {
      const backdrop = document.createElement('div');
      backdrop.className = 'ic-backdrop';

      // Sliders Inteligentes: Max exacto al 130% (+30% extra) del tamaño original
      let maxRangeWidth = Math.max(1, Math.round(state.originalWidth * 1.3));
      let maxRangeHeight = Math.max(1, Math.round(state.originalHeight * 1.3));

      backdrop.innerHTML = `
        <div class="ic-modal" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="ic-header">
            <div class="ic-title-group">
              <div class="ic-icon-badge">⚡</div>
              <div>
                <h3 class="ic-title">Compresor de Imagen (Puente Base64)</h3>
                <p class="ic-subtitle">Ajusta ancho, alto, recorta y optimiza calidad en tiempo real</p>
              </div>
            </div>
            <button class="ic-close-btn" id="ic-btn-close" title="Cerrar">&times;</button>
          </div>

          <!-- Body -->
          <div class="ic-body">
            <!-- Left: Visualizer -->
            <div class="ic-preview-container">
              <div class="ic-view-toggle">
                <button class="ic-toggle-btn" id="ic-tab-orig">Original</button>
                <button class="ic-toggle-btn ic-active" id="ic-tab-comp">Comprimida</button>
              </div>

              <div class="ic-img-wrapper">
                <span class="ic-preview-badge" id="ic-preview-badge">Vista Comprimida</span>
                <img class="ic-preview-img" id="ic-preview-img" alt="Vista Previa" />
                
                <!-- Botón Flotante para Recortar Imagen -->
                <button class="ic-btn-crop-trigger" id="ic-btn-open-crop" title="Abrir herramienta de recorte">
                  <span>✂️ Recortar Imagen</span>
                </button>

                <div class="ic-loading-overlay" id="ic-loading">
                  <div class="ic-spinner"></div>
                </div>
              </div>
            </div>

            <!-- Right: Controls -->
            <div class="ic-controls-container">
              <!-- Métricas de Tamaño -->
              <div class="ic-stats-grid">
                <div class="ic-stat-card">
                  <div class="ic-stat-label">Peso Original</div>
                  <div class="ic-stat-val" id="ic-stat-orig-size">0 KB</div>
                </div>
                <div class="ic-stat-card">
                  <div class="ic-stat-label">Nuevo Peso</div>
                  <div class="ic-stat-val ic-saved" id="ic-stat-comp-size">
                    0 KB <span class="ic-stat-val ic-saved-badge" id="ic-stat-savings">-0%</span>
                  </div>
                </div>

                <!-- Tarjeta interactiva con botón de Restablecer Dimensión Original -->
                <div class="ic-stat-card ic-stat-card-reset" id="ic-btn-reset-dim" title="Clic para restablecer las dimensiones y recorte original">
                  <div class="ic-stat-label" style="display: flex; align-items: center; justify-content: space-between;">
                    <span>Dimensión Orig.</span>
                    <span class="ic-reset-badge">↺ Reset</span>
                  </div>
                  <div class="ic-stat-val" id="ic-stat-orig-dim">0x0</div>
                </div>

                <div class="ic-stat-card">
                  <div class="ic-stat-label">Dimensión Final</div>
                  <div class="ic-stat-val" id="ic-stat-comp-dim">0x0</div>
                </div>
              </div>

              <!-- Palanca: Escalado Proporcionado Adaptable -->
              <div class="ic-aspect-bar">
                <div class="ic-aspect-title">
                  <span id="ic-aspect-icon">🔗</span>
                  <span>Escalado Proporcionado</span>
                </div>
                <label class="ic-toggle-switch">
                  <input type="checkbox" id="ic-toggle-aspect" ${state.lockAspectRatio ? 'checked' : ''} />
                  <span class="ic-toggle-slider"></span>
                </label>
              </div>

              <!-- Slider & Input 1: Ancho -->
              <div class="ic-field">
                <div class="ic-field-header">
                  <label class="ic-field-label">↔️ Ancho (Pixels)</label>
                  <span style="font-size: 0.7rem; color: #64748b;" id="ic-label-max-w">Max slider: ${maxRangeWidth}px</span>
                </div>
                <div class="ic-input-group">
                  <input type="range" class="ic-slider" id="ic-slider-width" min="1" max="${maxRangeWidth}" value="${state.targetWidth}" />
                  <input type="number" class="ic-num-input" id="ic-num-width" min="1" max="20000" value="${state.targetWidth}" />
                  <span class="ic-input-unit">px</span>
                </div>
              </div>

              <!-- Slider & Input 2: Alto -->
              <div class="ic-field">
                <div class="ic-field-header">
                  <label class="ic-field-label">↕️ Alto (Pixels)</label>
                  <span style="font-size: 0.7rem; color: #64748b;" id="ic-label-max-h">Max slider: ${maxRangeHeight}px</span>
                </div>
                <div class="ic-input-group">
                  <input type="range" class="ic-slider" id="ic-slider-height" min="1" max="${maxRangeHeight}" value="${state.targetHeight}" />
                  <input type="number" class="ic-num-input" id="ic-num-height" min="1" max="20000" value="${state.targetHeight}" />
                  <span class="ic-input-unit">px</span>
                </div>
              </div>

              <!-- Slider: Calidad -->
              <div class="ic-field">
                <div class="ic-field-header">
                  <label class="ic-field-label">🎯 Calidad de Imagen</label>
                  <span class="ic-field-val" id="ic-val-quality">75%</span>
                </div>
                <input type="range" class="ic-slider" id="ic-slider-quality" min="5" max="100" value="${Math.round(state.quality * 100)}" />
              </div>

              <!-- Selector de Formato -->
              <div class="ic-field">
                <div class="ic-field-header">
                  <label class="ic-field-label">💾 Formato de Salida</label>
                </div>
                <div class="ic-format-options">
                  <button class="ic-format-btn ${state.format === 'image/jpeg' ? 'ic-active' : ''}" data-format="image/jpeg">JPEG</button>
                  <button class="ic-format-btn ${state.format === 'image/webp' ? 'ic-active' : ''}" data-format="image/webp">WEBP</button>
                  <button class="ic-format-btn ${state.format === 'image/png' ? 'ic-active' : ''}" data-format="image/png">PNG</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="ic-footer">
            <button class="ic-btn ic-btn-cancel" id="ic-btn-cancel">Cancelar</button>
            <button class="ic-btn ic-btn-primary" id="ic-btn-submit">
              <span>🚀 Obtener Base64 Comprimido</span>
            </button>
          </div>

          <!-- SUB-MODAL DE RECORTE ("Un puente dentro del puente") -->
          <div class="ic-crop-overlay" id="ic-crop-overlay">
            <div class="ic-crop-header">
              <div class="ic-crop-title-text">
                <span>✂️ Recortador de Imagen</span>
              </div>
              <div class="ic-crop-presets">
                <button class="ic-crop-preset-btn ic-active" data-ratio="free">Libre</button>
                <button class="ic-crop-preset-btn" data-ratio="1">1:1</button>
                <button class="ic-crop-preset-btn" data-ratio="1.777777778">16:9</button>
                <button class="ic-crop-preset-btn" data-ratio="1.333333333">4:3</button>
                <button class="ic-crop-preset-btn" data-ratio="0.5625">9:16</button>
              </div>
            </div>
            <div class="ic-crop-stage" id="ic-crop-stage">
              <div class="ic-crop-wrapper" id="ic-crop-wrapper">
                <img class="ic-crop-img" id="ic-crop-img" alt="Recortando" />
                <div class="ic-crop-box" id="ic-crop-box">
                  <div class="ic-crop-handle nw" data-handle="nw"></div>
                  <div class="ic-crop-handle ne" data-handle="ne"></div>
                  <div class="ic-crop-handle sw" data-handle="sw"></div>
                  <div class="ic-crop-handle se" data-handle="se"></div>
                  <span class="ic-crop-dim-badge" id="ic-crop-dim-badge">0 × 0 px</span>
                </div>
              </div>
            </div>
            <div class="ic-crop-footer">
              <button class="ic-btn ic-btn-cancel" id="ic-btn-crop-cancel">Cancelar</button>
              <button class="ic-btn ic-btn-primary" id="ic-btn-crop-confirm">
                <span>✅ Insertar en el Editor</span>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);

      // Trigger reflow para animación CSS
      requestAnimationFrame(() => backdrop.classList.add('ic-visible'));

      // Referencias de UI
      const ui = {
        backdrop,
        previewImg: backdrop.querySelector('#ic-preview-img'),
        previewBadge: backdrop.querySelector('#ic-preview-badge'),
        loading: backdrop.querySelector('#ic-loading'),
        btnOpenCrop: backdrop.querySelector('#ic-btn-open-crop'),
        tabOrig: backdrop.querySelector('#ic-tab-orig'),
        tabComp: backdrop.querySelector('#ic-tab-comp'),
        statOrigSize: backdrop.querySelector('#ic-stat-orig-size'),
        statCompSize: backdrop.querySelector('#ic-stat-comp-size'),
        statSavings: backdrop.querySelector('#ic-stat-savings'),
        statOrigDim: backdrop.querySelector('#ic-stat-orig-dim'),
        statCompDim: backdrop.querySelector('#ic-stat-comp-dim'),
        btnResetDim: backdrop.querySelector('#ic-btn-reset-dim'),
        toggleAspect: backdrop.querySelector('#ic-toggle-aspect'),
        aspectIcon: backdrop.querySelector('#ic-aspect-icon'),
        sliderWidth: backdrop.querySelector('#ic-slider-width'),
        numWidth: backdrop.querySelector('#ic-num-width'),
        sliderHeight: backdrop.querySelector('#ic-slider-height'),
        numHeight: backdrop.querySelector('#ic-num-height'),
        labelMaxW: backdrop.querySelector('#ic-label-max-w'),
        labelMaxH: backdrop.querySelector('#ic-label-max-h'),
        sliderQuality: backdrop.querySelector('#ic-slider-quality'),
        valQuality: backdrop.querySelector('#ic-val-quality'),
        formatBtns: backdrop.querySelectorAll('.ic-format-btn'),
        btnSubmit: backdrop.querySelector('#ic-btn-submit'),
        btnCancel: backdrop.querySelector('#ic-btn-cancel'),
        btnClose: backdrop.querySelector('#ic-btn-close'),
        // Recortador UI
        cropOverlay: backdrop.querySelector('#ic-crop-overlay'),
        cropImg: backdrop.querySelector('#ic-crop-img'),
        cropWrapper: backdrop.querySelector('#ic-crop-wrapper'),
        cropBox: backdrop.querySelector('#ic-crop-box'),
        cropDimBadge: backdrop.querySelector('#ic-crop-dim-badge'),
        btnCropConfirm: backdrop.querySelector('#ic-btn-crop-confirm'),
        btnCropCancel: backdrop.querySelector('#ic-btn-crop-cancel'),
        cropPresetBtns: backdrop.querySelectorAll('.ic-crop-preset-btn')
      };

      // Timer throttling para actualización visual fluida
      let updateTimer = null;
      const triggerUpdate = () => {
        clearTimeout(updateTimer);
        updateTimer = setTimeout(() => {
          ImageCompressor.updateCompression(state, ui);
        }, 40);
      };

      // Recalcular límites de sliders (+30%) y actualizar UI
      const updateSliderLimitsUI = () => {
        maxRangeWidth = Math.max(1, Math.round(state.originalWidth * 1.3));
        maxRangeHeight = Math.max(1, Math.round(state.originalHeight * 1.3));

        ui.sliderWidth.max = maxRangeWidth;
        ui.sliderHeight.max = maxRangeHeight;

        ui.labelMaxW.textContent = `Max slider: ${maxRangeWidth}px`;
        ui.labelMaxH.textContent = `Max slider: ${maxRangeHeight}px`;

        syncDimensionsUI();
      };

      // Sincronizar UI de Ancho y Alto
      const syncDimensionsUI = () => {
        ui.sliderWidth.value = Math.min(maxRangeWidth, state.targetWidth);
        ui.numWidth.value = state.targetWidth;
        ui.sliderHeight.value = Math.min(maxRangeHeight, state.targetHeight);
        ui.numHeight.value = state.targetHeight;
      };

      // Botón para restablecer dimensión y relación de aspecto original (master sin recorte)
      ui.btnResetDim.addEventListener('click', () => {
        state.originalImage = state.masterImage;
        state.originalDataUrl = state.masterDataUrl;
        state.originalWidth = state.masterWidth;
        state.originalHeight = state.masterHeight;
        state.aspectRatio = state.masterWidth / state.masterHeight;
        state.targetWidth = state.masterWidth;
        state.targetHeight = state.masterHeight;

        updateSliderLimitsUI();
        triggerUpdate();
      });

      // Cambio en Ancho (Slider o Input manual)
      const onWidthChange = (val) => {
        let w = parseInt(val, 10);
        if (isNaN(w) || w < 1) w = 1;
        state.targetWidth = w;

        if (state.lockAspectRatio && state.aspectRatio > 0) {
          state.targetHeight = Math.max(1, Math.round(w / state.aspectRatio));
        }
        syncDimensionsUI();
        triggerUpdate();
      };

      // Cambio en Alto (Slider o Input manual)
      const onHeightChange = (val) => {
        let h = parseInt(val, 10);
        if (isNaN(h) || h < 1) h = 1;
        state.targetHeight = h;

        if (state.lockAspectRatio && state.aspectRatio > 0) {
          state.targetWidth = Math.max(1, Math.round(h * state.aspectRatio));
        }
        syncDimensionsUI();
        triggerUpdate();
      };

      ui.sliderWidth.addEventListener('input', (e) => onWidthChange(e.target.value));
      ui.numWidth.addEventListener('input', (e) => onWidthChange(e.target.value));

      ui.sliderHeight.addEventListener('input', (e) => onHeightChange(e.target.value));
      ui.numHeight.addEventListener('input', (e) => onHeightChange(e.target.value));

      // Palanca Escalado Proporcionado Adaptable
      ui.toggleAspect.addEventListener('change', (e) => {
        state.lockAspectRatio = e.target.checked;
        ui.aspectIcon.textContent = state.lockAspectRatio ? '🔗' : '🔓';

        if (state.lockAspectRatio) {
          if (state.targetHeight > 0) {
            state.aspectRatio = state.targetWidth / state.targetHeight;
          }
          syncDimensionsUI();
          triggerUpdate();
        }
      });

      // Calidad Slider
      ui.sliderQuality.addEventListener('input', () => {
        state.quality = parseInt(ui.sliderQuality.value, 10) / 100;
        ui.valQuality.textContent = `${ui.sliderQuality.value}%`;
        triggerUpdate();
      });

      // Selector de Formato
      ui.formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          ui.formatBtns.forEach(b => b.classList.remove('ic-active'));
          btn.classList.add('ic-active');
          state.format = btn.getAttribute('data-format');
          triggerUpdate();
        });
      });

      // Tabs Vista Previa
      ui.tabOrig.addEventListener('click', () => {
        state.activeTab = 'original';
        ui.tabOrig.classList.add('ic-active');
        ui.tabComp.classList.remove('ic-active');
        ui.previewImg.src = state.originalDataUrl;
        ui.previewBadge.textContent = 'Imagen Original';
      });

      ui.tabComp.addEventListener('click', () => {
        state.activeTab = 'compressed';
        ui.tabComp.classList.add('ic-active');
        ui.tabOrig.classList.remove('ic-active');
        ui.previewImg.src = state.compressedDataUrl;
        ui.previewBadge.textContent = 'Vista Comprimida';
      });

      // -------------------------------------------------------------
      // LÓGICA INTERACTIVA DEL RECORTADOR DE IMAGEN
      // -------------------------------------------------------------
      let cropState = {
        active: false,
        x: 0, y: 0, w: 0, h: 0,
        presetRatio: 'free', // 'free' | number
        isDragging: false,
        activeHandle: null,
        startX: 0, startY: 0,
        initialBox: { x: 0, y: 0, w: 0, h: 0 }
      };

      const updateCropBoxDOM = () => {
        ui.cropBox.style.left = `${cropState.x}px`;
        ui.cropBox.style.top = `${cropState.y}px`;
        ui.cropBox.style.width = `${cropState.w}px`;
        ui.cropBox.style.height = `${cropState.h}px`;

        // Calcular dimensión real recortada en píxeles del mapa de la imagen
        const displayedW = ui.cropImg.clientWidth || 1;
        const displayedH = ui.cropImg.clientHeight || 1;
        const scaleX = state.originalWidth / displayedW;
        const scaleY = state.originalHeight / displayedH;

        const realW = Math.round(cropState.w * scaleX);
        const realH = Math.round(cropState.h * scaleY);
        ui.cropDimBadge.textContent = `${realW} × ${realH} px`;
      };

      const initCropBox = () => {
        const dispW = ui.cropImg.clientWidth;
        const dispH = ui.cropImg.clientHeight;

        // Iniciar cuadro de recorte al 80% centrado
        let boxW = dispW * 0.8;
        let boxH = dispH * 0.8;

        if (cropState.presetRatio !== 'free') {
          const ratio = parseFloat(cropState.presetRatio);
          if (boxW / boxH > ratio) {
            boxW = boxH * ratio;
          } else {
            boxH = boxW / ratio;
          }
        }

        cropState.w = Math.max(40, boxW);
        cropState.h = Math.max(40, boxH);
        cropState.x = (dispW - cropState.w) / 2;
        cropState.y = (dispH - cropState.h) / 2;

        updateCropBoxDOM();
      };

      ui.btnOpenCrop.addEventListener('click', () => {
        ui.cropOverlay.classList.add('ic-active');
        ui.cropImg.src = state.originalDataUrl;

        ui.cropImg.onload = () => {
          setTimeout(initCropBox, 50);
        };
        if (ui.cropImg.complete) {
          setTimeout(initCropBox, 50);
        }
      });

      // Presets del Recortador
      ui.cropPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          ui.cropPresetBtns.forEach(b => b.classList.remove('ic-active'));
          btn.classList.add('ic-active');
          cropState.presetRatio = btn.getAttribute('data-ratio');
          initCropBox();
        });
      });

      // Eventos Drag y Resize del cuadro de recorte
      const onPointerDown = (e) => {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        cropState.isDragging = true;
        cropState.startX = clientX;
        cropState.startY = clientY;
        cropState.initialBox = { x: cropState.x, y: cropState.y, w: cropState.w, h: cropState.h };

        const handleEl = e.target.closest('.ic-crop-handle');
        cropState.activeHandle = handleEl ? handleEl.getAttribute('data-handle') : null;

        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);
      };

      const onPointerMove = (e) => {
        if (!cropState.isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - cropState.startX;
        const dy = clientY - cropState.startY;

        const maxW = ui.cropImg.clientWidth;
        const maxH = ui.cropImg.clientHeight;

        if (!cropState.activeHandle) {
          // Mover cuadro completo
          let newX = cropState.initialBox.x + dx;
          let newY = cropState.initialBox.y + dy;

          newX = Math.max(0, Math.min(maxW - cropState.w, newX));
          newY = Math.max(0, Math.min(maxH - cropState.h, newY));

          cropState.x = newX;
          cropState.y = newY;
        } else {
          // Redimensionar por esquinas
          let newX = cropState.initialBox.x;
          let newY = cropState.initialBox.y;
          let newW = cropState.initialBox.w;
          let newH = cropState.initialBox.h;

          const h = cropState.activeHandle;
          if (h.includes('e')) newW = Math.max(40, Math.min(maxW - newX, cropState.initialBox.w + dx));
          if (h.includes('s')) newH = Math.max(40, Math.min(maxH - newY, cropState.initialBox.h + dy));
          if (h.includes('w')) {
            const possibleW = cropState.initialBox.w - dx;
            if (possibleW >= 40 && cropState.initialBox.x + dx >= 0) {
              newX = cropState.initialBox.x + dx;
              newW = possibleW;
            }
          }
          if (h.includes('n')) {
            const possibleH = cropState.initialBox.h - dy;
            if (possibleH >= 40 && cropState.initialBox.y + dy >= 0) {
              newY = cropState.initialBox.y + dy;
              newH = possibleH;
            }
          }

          if (cropState.presetRatio !== 'free') {
            const ratio = parseFloat(cropState.presetRatio);
            newH = newW / ratio;
          }

          cropState.x = newX;
          cropState.y = newY;
          cropState.w = newW;
          cropState.h = newH;
        }

        updateCropBoxDOM();
      };

      const onPointerUp = () => {
        cropState.isDragging = false;
        cropState.activeHandle = null;
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
      };

      ui.cropBox.addEventListener('mousedown', onPointerDown);
      ui.cropBox.addEventListener('touchstart', onPointerDown, { passive: false });

      // Botón: Cancelar Recorte
      ui.btnCropCancel.addEventListener('click', () => {
        ui.cropOverlay.classList.remove('ic-active');
      });

      // Botón: "✅ Insertar en el Editor"
      ui.btnCropConfirm.addEventListener('click', () => {
        ui.loading.classList.add('ic-active');

        // Mapear coordenadas de la imagen renderizada a la imagen original real
        const dispW = ui.cropImg.clientWidth || 1;
        const dispH = ui.cropImg.clientHeight || 1;
        const scaleX = state.originalWidth / dispW;
        const scaleY = state.originalHeight / dispH;

        const cropX = Math.round(cropState.x * scaleX);
        const cropY = Math.round(cropState.y * scaleY);
        const cropW = Math.max(1, Math.round(cropState.w * scaleX));
        const cropH = Math.max(1, Math.round(cropState.h * scaleY));

        const canvas = document.createElement('canvas');
        canvas.width = cropW;
        canvas.height = cropH;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(state.originalImage, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const croppedDataUrl = canvas.toDataURL(state.format, 1.0);
        const croppedImg = new Image();

        croppedImg.onload = () => {
          // Reemplazar la imagen activa en el editor por la imagen recortada
          state.originalImage = croppedImg;
          state.originalDataUrl = croppedDataUrl;
          state.originalWidth = croppedImg.naturalWidth;
          state.originalHeight = croppedImg.naturalHeight;
          state.aspectRatio = croppedImg.naturalWidth / croppedImg.naturalHeight;
          state.targetWidth = croppedImg.naturalWidth;
          state.targetHeight = croppedImg.naturalHeight;

          ui.cropOverlay.classList.remove('ic-active');
          updateSliderLimitsUI();
          triggerUpdate();
        };

        croppedImg.src = croppedDataUrl;
      });

      const closeModal = (userConfirmed = false) => {
        backdrop.classList.remove('ic-visible');
        setTimeout(() => {
          if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        }, 250);

        if (userConfirmed) {
          const savings = Math.max(0, Math.round(((state.originalSizeBytes - state.compressedSizeBytes) / state.originalSizeBytes) * 100));
          resolve({
            base64: state.compressedDataUrl,
            originalSize: state.originalSizeBytes,
            compressedSize: state.compressedSizeBytes,
            formattedOriginalSize: ImageCompressor.formatBytes(state.originalSizeBytes),
            formattedCompressedSize: ImageCompressor.formatBytes(state.compressedSizeBytes),
            savingsPercent: savings,
            width: state.compressedWidth,
            height: state.compressedHeight,
            fileName: state.fileName,
            quality: state.quality,
            format: state.format,
            lockAspectRatio: state.lockAspectRatio
          });
        } else {
          reject(new Error('Compresión cancelada por el usuario.'));
        }
      };

      ui.btnSubmit.addEventListener('click', () => closeModal(true));
      ui.btnCancel.addEventListener('click', () => closeModal(false));
      ui.btnClose.addEventListener('click', () => closeModal(false));

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(false);
      });

      return ui;
    }

    /**
     * Re-calcula la compresión y actualiza los indicadores en tiempo real.
     */
    static updateCompression(state, ui) {
      ui.loading.classList.add('ic-active');

      setTimeout(() => {
        const result = ImageCompressor.compressCanvas(
          state.originalImage,
          state.quality,
          state.targetWidth,
          state.targetHeight,
          state.format
        );

        state.compressedDataUrl = result.base64;
        state.compressedSizeBytes = result.sizeBytes;
        state.compressedWidth = result.width;
        state.compressedHeight = result.height;

        // Actualizar visualización
        if (state.activeTab === 'compressed') {
          ui.previewImg.src = state.compressedDataUrl;
        }

        // Estadísticas
        ui.statOrigSize.textContent = ImageCompressor.formatBytes(state.originalSizeBytes);
        ui.statCompSize.firstChild.textContent = `${ImageCompressor.formatBytes(state.compressedSizeBytes)} `;

        const savingsPercent = Math.max(0, Math.round(((state.originalSizeBytes - state.compressedSizeBytes) / state.originalSizeBytes) * 100));
        ui.statSavings.textContent = `-${savingsPercent}%`;

        ui.statOrigDim.textContent = `${state.originalWidth}×${state.originalHeight}`;
        ui.statCompDim.textContent = `${state.compressedWidth}×${state.compressedHeight}`;

        ui.loading.classList.remove('ic-active');
      }, 10);
    }
  }

  // Exportar globalmente
  global.ImageCompressor = ImageCompressor;

})(typeof window !== 'undefined' ? window : this);
