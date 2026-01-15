/*
  js/ul.js

  Define um único objeto global: UI

  Métodos utilitários para formatação, manipulação de elementos e renderização de resultados.

  - formatNumber(number, decimals): formata número com separadores pt-BR
  - formatCurrency(value): formata moeda R$
  - showElement(elementId), hideElement(elementId): controla visibilidade
  - scrollToElement(elementId): scroll suave
  - renderResults(data): renderiza cards com resultado do cálculo
  - renderComparison(modesArray, selectedMode): compara emissões entre modos
  - renderCarbonCredits(creditsData): exibe créditos de carbono
  - showLoading(buttonElement), hideLoading(buttonElement): estado de carregamento
*/

var UI = (function () {
  'use strict';

  /* UTILITY METHODS */

  /**
   * Formata um número com casas decimais e separadores pt-BR.
   * Utiliza toLocaleString para aplicar formatação regional.
   */
  function formatNumber(number, decimals) {
    var num = Number(number);
    if (!isFinite(num)) return '0';
    if (typeof decimals === 'undefined') decimals = 2;
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Formata um valor como moeda brasileira (R$).
   */
  function formatCurrency(value) {
    var num = Number(value);
    if (!isFinite(num)) return 'R$ 0,00';
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  /**
   * Remove a classe "hidden" de um elemento, tornando-o visível.
   */
  function showElement(elementId) {
    var el = document.getElementById(elementId);
    if (el) {
      el.classList.remove('hidden');
      el.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Adiciona a classe "hidden" a um elemento, ocultando-o.
   */
  function hideElement(elementId) {
    var el = document.getElementById(elementId);
    if (el) {
      el.classList.add('hidden');
      el.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Faz scroll suave até o elemento com o ID fornecido.
   */
  function scrollToElement(elementId) {
    var el = document.getElementById(elementId);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* RENDERING METHODS */

  /**
   * Renderiza cards de resultado do cálculo.
   * data = { origin, destination, distance, emission, mode, savings }
   * Retorna HTML string com cards para rota, distância, emissão, transporte e economia (se aplicável).
   */
  function renderResults(data) {
    if (!data) return '';

    var modeData = window.CONFIG && CONFIG.TRANSPORT_MODES[data.mode];
    var modeIcon = modeData ? modeData.icon : '🚗';
    var modeLabel = modeData ? modeData.label : data.mode;

    var html = '<div class="ui__results-cards">';

    // Card: Trajeto
    html += '<div class="ui__result-card ui__result-card--route">';
    html += '<h3 class="ui__result-card__title">Trajeto</h3>';
    html += '<div class="ui__result-card__content">';
    html += '<span class="ui__result-city">' + (data.origin || '—') + '</span>';
    html += '<span class="ui__result-arrow"> → </span>';
    html += '<span class="ui__result-city">' + (data.destination || '—') + '</span>';
    html += '</div>';
    html += '</div>';

    // Card: Distância
    html += '<div class="ui__result-card ui__result-card--distance">';
    html += '<h3 class="ui__result-card__title">Distância</h3>';
    html += '<div class="ui__result-card__content">';
    html += '<span class="ui__result-value">' + formatNumber(data.distance, 0) + '</span>';
    html += '<span class="ui__result-unit">km</span>';
    html += '</div>';
    html += '</div>';

    // Card: Emissão
    html += '<div class="ui__result-card ui__result-card--emission">';
    html += '<h3 class="ui__result-card__title">Emissão de CO₂</h3>';
    html += '<div class="ui__result-card__content">';
    html += '<span class="ui__result-emoji">🍃</span>';
    html += '<span class="ui__result-value">' + formatNumber(data.emission, 2) + '</span>';
    html += '<span class="ui__result-unit">kg</span>';
    html += '</div>';
    html += '</div>';

    // Card: Modo de Transporte
    html += '<div class="ui__result-card ui__result-card--transport">';
    html += '<h3 class="ui__result-card__title">Modo</h3>';
    html += '<div class="ui__result-card__content">';
    html += '<span class="ui__result-emoji">' + modeIcon + '</span>';
    html += '<span class="ui__result-value">' + modeLabel + '</span>';
    html += '</div>';
    html += '</div>';

    // Card: Economia (se houver e modo não for "car")
    if (data.savings && data.mode !== 'car') {
      html += '<div class="ui__result-card ui__result-card--savings">';
      html += '<h3 class="ui__result-card__title">Economia</h3>';
      html += '<div class="ui__result-card__content">';
      html += '<span class="ui__result-value">' + formatNumber(data.savings.savedKg, 2) + '</span>';
      html += '<span class="ui__result-unit">kg economizados</span>';
      if (data.savings.percentage !== null) {
        html += '<span class="ui__result-percentage">(' + formatNumber(data.savings.percentage, 1) + '%)</span>';
      }
      html += '</div>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  /**
   * Renderiza comparação de emissões entre modos de transporte.
   * modesArray: array de { mode, emission, percentageVsCar } do Calculator.calculateAllModes()
   * selectedMode: modo selecionado para highlight
   * Retorna HTML string com progress bars coloridos e dica.
   */
  function renderComparison(modesArray, selectedMode) {
    if (!modesArray || modesArray.length === 0) return '';

    var emissions = modesArray.map(function (m) { return m.emission; });
    var maxEmission = Math.max.apply(null, emissions);

    // Adiciona título principal
    var html = '<h3 class="ui__comparison-title">Comparação de Emissões por Modo de Transporte</h3>';
    html += '<div class="ui__comparison-list">';

    modesArray.forEach(function (mode) {
      var isSelected = mode.mode === selectedMode;
      var modeData = window.CONFIG && CONFIG.TRANSPORT_MODES[mode.mode];
      var modeIcon = modeData ? modeData.icon : '🚗';
      var modeLabel = modeData ? modeData.label : mode.mode;
      var modeColor = modeData ? modeData.color : '#0B84A5';

      // Container item
      html += '<div class="ui__comparison-item' + (isSelected ? ' ui__comparison-item--selected' : '') + '">';

      // Header
      html += '<div class="ui__comparison-item__header">';
      html += '<span class="ui__comparison-item__icon">' + modeIcon + '</span>';
      html += '<div class="ui__comparison-item__label-wrapper">';
      html += '<span class="ui__comparison-item__label">' + modeLabel + '</span>';
      if (isSelected) {
        html += '<span class="ui__comparison-item__badge">Selecionado</span>';
      }
      html += '</div>';
      html += '</div>';

      // Stats
      html += '<div class="ui__comparison-item__stats">';
      html += '<span class="ui__comparison-item__emission">' + formatNumber(mode.emission, 2) + ' kg</span>';
      if (mode.percentageVsCar !== null) {
        html += '<span class="ui__comparison-item__percentage">' + formatNumber(mode.percentageVsCar, 0) + '% do carro</span>';
      }
      html += '</div>';

      // Progress bar com cor-coding
      var percentage = maxEmission > 0 ? (mode.emission / maxEmission) * 100 : 0;
      var barColor = '#2EC4B6'; // verde default
      if (percentage > 100) {
        barColor = '#E05A5A'; // vermelho
      } else if (percentage > 75) {
        barColor = '#F6A623'; // laranja
      } else if (percentage > 25) {
        barColor = '#FFC107'; // amarelo
      }

      html += '<div class="ui__comparison-item__bar-container">';
      html += '<div class="ui__comparison-item__bar" style="width:' + Math.min(100, percentage) + '%; background-color:' + barColor + ';"></div>';
      html += '</div>';

      html += '</div>';
    });

    html += '</div>';

    // Info box
    html += '<div class="ui__comparison-info">';
    html += '<h4 class="ui__comparison-info__title">💡 Dica</h4>';
    html += '<p class="ui__comparison-info__text">Modos com menor emissão ajudam a reduzir o impacto ambiental. Considere usar bicicleta ou transporte público quando possível!</p>';
    html += '</div>';

    return html;
  }

  /**
   * Renderiza cards de créditos de carbono.
   * creditsData: { credits, price: { min, max, average } }
   * Retorna HTML string com cards e informações.
   */
  function renderCarbonCredits(creditsData) {
    if (!creditsData) return '';

    var html = '<div class="ui__carbon-grid">';

    // Card: Créditos
    html += '<div class="ui__carbon-card ui__carbon-card--credits">';
    html += '<h3 class="ui__carbon-card__title">Créditos de Carbono Necessários</h3>';
    html += '<div class="ui__carbon-card__content">';
    html += '<span class="ui__carbon-card__value">' + formatNumber(creditsData.credits, 4) + '</span>';
    html += '<span class="ui__carbon-card__unit">créditos</span>';
    html += '</div>';
    html += '<p class="ui__carbon-card__helper">1 crédito = 1.000 kg CO₂</p>';
    html += '</div>';

    // Card: Preço estimado
    html += '<div class="ui__carbon-card ui__carbon-card--price">';
    html += '<h3 class="ui__carbon-card__title">Preço Estimado</h3>';
    html += '<div class="ui__carbon-card__content">';
    html += '<span class="ui__carbon-card__value">' + formatCurrency(creditsData.price.average) + '</span>';
    html += '<span class="ui__carbon-card__range">(' + formatCurrency(creditsData.price.min) + ' - ' + formatCurrency(creditsData.price.max) + ')</span>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    // Info box
    html += '<div class="ui__carbon-info">';
    html += '<h4 class="ui__carbon-info__title">❓ O que são Créditos de Carbono?</h4>';
    html += '<p class="ui__carbon-info__text">Créditos de carbono representam uma tonelada métrica (1.000 kg) de CO₂ evitada ou removida da atmosfera. Ao compensar suas emissões, você contribui para projetos de reforestamento e energia limpa.</p>';
    html += '</div>';

    // Button (não-funcional para demo)
    html += '<div class="ui__carbon-actions">';
    html += '<button class="ui__carbon-btn" disabled>Compensar Emissão (em desenvolvimento)</button>';
    html += '</div>';

    return html;
  }

  /**
   * Mostra estado de carregamento no botão.
   * Salva o texto original em data-original-text e exibe spinner.
   */
  function showLoading(buttonElement) {
    if (!buttonElement) return;
    buttonElement.dataset.originalText = buttonElement.textContent;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="ui__spinner"></span> Calculando...';
  }

  /**
   * Remove estado de carregamento e restaura o texto original.
   */
  function hideLoading(buttonElement) {
    if (!buttonElement) return;
    buttonElement.disabled = false;
    buttonElement.textContent = buttonElement.dataset.originalText || 'Calcular Emissão';
  }

  // API pública
  return {
    formatNumber: formatNumber,
    formatCurrency: formatCurrency,
    showElement: showElement,
    hideElement: hideElement,
    scrollToElement: scrollToElement,
    renderResults: renderResults,
    renderComparison: renderComparison,
    renderCarbonCredits: renderCarbonCredits,
    showLoading: showLoading,
    hideLoading: hideLoading
  };
})();