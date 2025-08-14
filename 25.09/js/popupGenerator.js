// popupGenerator.js
import { CONFIG } from './config.js';

export class PopupGenerator {
  static generate(actionsData) {
    if (!actionsData || actionsData.length === 0) return '';
    const firstAction = actionsData[0];
    const [lat, lon] = firstAction.coordonnees.split(',').map(s => s.trim());

    return `
      ${this.generateBandeau(firstAction, lat, lon)}
      ${this.generateIcons(firstAction, lat, lon)}
      ${this.generateTitle(firstAction)}
      ${this.generateActions(actionsData)}
      ${this.generateFooter(firstAction)}
    `;
  }

  static generateBandeau(firstAction, lat, lon) {
    const color = CONFIG.operators[firstAction.operateur]?.color || '#000000';
    const link = `https://data.anfr.fr/visualisation/map/?id=observatoire_2g_3g_4g&location=17,${lat},${lon}`;
    return `<div class="bandeau" style="background-color:${color};">
      <a href="${link}" target="_blank" rel="noopener">Support n°${firstAction.id_support}</a>
    </div>`;
  }

  static generateIcons(firstAction, lat, lon) {
    const icons = [];
    const base = CONFIG.baseIconUrl;
    icons.push(`<a href="https://cartoradio.fr/index.html#/cartographie/lonlat/${lon}/${lat}" target="_blank" rel="noopener" class="icone"><img loading="lazy" src="${base}cartoradio.avif" alt="Cartoradio"></a>`);
    icons.push(`<a href="https://www.google.fr/maps/place/${lat},${lon}" target="_blank" rel="noopener" class="icone"><img loading="lazy" src="${base}maps.avif" alt="Google Maps"></a>`);
    if (['FREE MOBILE','TELCO OI'].includes(firstAction.operateur)) {
      icons.push(`<a href="https://rncmobile.net/site/${lat},${lon}" target="_blank" rel="noopener" class="icone"><img loading="lazy" src="${base}rnc.avif" alt="RNC Mobile"></a>`);
    }
    return `<div class="icone-container">${icons.join('')}</div>`;
  }

  static generateTitle(firstAction) {
    return `<div class="titre"><strong>${firstAction.adresse}</strong></div>`;
  }

  static generateActions(actionsData) {
    const actionsByType = {};
    actionsData.forEach(action => {
      if (!actionsByType[action.action]) actionsByType[action.action] = [];
      actionsByType[action.action].push(action);
    });

    let html = '<div class="contenu">';
    for (const [actionType, actions] of Object.entries(actionsByType)) {
      const actionTitle = CONFIG.actions[actionType] || actionType;
      html += `<div class="action-groupe"><div class="action-titre">${actionTitle} :</div><div>${actions.map(a => a.technologie).join('<br>')}</div></div>`;
    }
    html += '</div>';
    return html;
  }

  static generateFooter(firstAction) {
    return `<div class="titre">${firstAction.type_support} - ${firstAction.hauteur_support} - ${firstAction.proprietaire_support}</div>`;
  }
}