// utils.js - utilitaires généraux
export const Utils = {
  csvToRows(text) {
    if (!text) return [];
    // Ignore BOMs and normalize line endings
    const clean = text.replace(/^\uFEFF/, '').trim();
    const lines = clean.split(/\r?\n/);
    if (lines.length <= 1) return [];
    const header = lines.shift();
    return lines.map(line => {
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, ''));
      return {
        id_support: values[0],
        operateur: values[1],
        action: values[2],
        technologie: values[3],
        adresse: values[4],
        code_insee: values[5],
        coordonnees: values[6],
        type_support: values[7],
        hauteur_support: values[8],
        proprietaire_support: values[9],
        date_activ: values[10],
        is_zb: values[11]?.toLowerCase().trim() || 'false',
        is_new: values[12]?.toLowerCase().trim() || 'false'
      };
    });
  },

  extractBaseTech(tech) {
    return tech.replace(/\s*\d{3,4}$/, '').trim();
  },

  extractFreq(tech) {
    return (tech.match(/(\d{3,4})$/) || [])[1] || null;
  },

  // Charge un script externe de manière asynchrone, avec fallback local
  loadScript(src, { module = false, integrity = null, crossOrigin = null, fallback = null } = {}) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      if (module) s.type = 'module';
      s.src = src;
      if (integrity) s.integrity = integrity;
      if (crossOrigin) s.crossOrigin = crossOrigin;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        if (fallback) {
          const s2 = document.createElement('script');
          s2.src = fallback;
          s2.async = true;
          s2.onload = () => resolve();
          s2.onerror = () => reject(new Error('Both script and fallback failed: ' + src));
          document.head.appendChild(s2);
        } else {
          reject(new Error('Script load failed: ' + src));
        }
      };
      document.head.appendChild(s);
    });
  },

  loadCss(href, { preload = false } = {}) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('CSS load failed: ' + href));
      document.head.appendChild(link);
    });
  },

  debounce(fn, wait = 200) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  },

  safeParseFloatPair(coordString) {
    if (!coordString) return [NaN, NaN];
    const parts = coordString.split(',').map(s => parseFloat(s.trim()));
    return parts.length >= 2 ? [parts[0], parts[1]] : [NaN, NaN];
  },

  makeUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const csvPath = params.get('csv');
    const baseUrl = (csvPath ? csvPath : 'hebdo/index');
    return {
      csvUrl: `${CONFIG.baseDataUrl}${baseUrl}.csv?t=${Date.now()}`,
      timestampUrl: `${CONFIG.baseDataUrl}${baseUrl.replace('index','timestamp')}.txt?t=${Date.now()}`
    };
  }
};
