/*
  js/app.js

  Arquivo principal de integração da Calculadora de Emissão de CO2.

  Responsabilidades:
  - Inicialização quando o DOM está pronto
  - Captura e processamento do submit do formulário
  - Validação de entradas
  - Orquestração de cálculos (Calculator)
  - Renderização de resultados (UI)
  - Tratamento de erros e feedback ao usuário
*/

(function () {
  'use strict';

  /* ============================================
     INICIALIZAÇÃO (quando DOM está pronto)
     ============================================ */

  function init() {
    console.log('Calculadora Inicializada!');

    // 1. Popula o datalist com cidades disponíveis
    if (typeof CONFIG !== 'undefined' && CONFIG.populateDatalist) {
      CONFIG.populateDatalist();
    }

    // 2. Ativa o preenchimento automático de distância
    if (typeof CONFIG !== 'undefined' && CONFIG.setupDistanceAutofill) {
      CONFIG.setupDistanceAutofill();
    }

    // 3. Obtém referência ao formulário
    var form = document.getElementById('calculator-form');
    if (!form) {
      console.error('Formulário #calculator-form não encontrado.');
      return;
    }

    // 4. Adiciona listener ao evento submit
    form.addEventListener('submit', handleFormSubmit);
  }

  /* ============================================
     HANDLER DO SUBMIT DO FORMULÁRIO
     ============================================ */

  function handleFormSubmit(e) {
    // 1. Impede o envio padrão do formulário
    e.preventDefault();

    // 2. Captura todos os valores do formulário
    var originInput = document.getElementById('origin');
    var destinationInput = document.getElementById('destination');
    var distanceInput = document.getElementById('distance');
    var transportRadios = document.getElementsByName('transport');

    var origin = originInput ? originInput.value.trim() : '';
    var destination = destinationInput ? destinationInput.value.trim() : '';
    var distance = distanceInput ? parseFloat(distanceInput.value) : 0;

    // Obtém o modo de transporte selecionado
    var selectedMode = 'car';
    for (var i = 0; i < transportRadios.length; i++) {
      if (transportRadios[i].checked) {
        selectedMode = transportRadios[i].value;
        break;
      }
    }

    // 3. Valida os inputs
    if (!origin || !destination || !distance) {
      alert('Por favor, preencha todos os campos (origem, destino e distância).');
      return;
    }

    if (isNaN(distance) || distance <= 0) {
      alert('A distância deve ser um número maior que zero.');
      return;
    }

    // 4. Obtém o botão de submit para exibir estado de carregamento
    var submitButton = document.querySelector('[type="submit"]');

    // 5. Mostra estado de carregamento
    if (typeof UI !== 'undefined' && UI.showLoading) {
      UI.showLoading(submitButton);
    }

    // 6. Oculta seções de resultados anteriores
    if (typeof UI !== 'undefined') {
      UI.hideElement('results');
      UI.hideElement('comparison');
      UI.hideElement('carbon-credits');
    }

    // 7. Simula processamento com delay (1500ms)
    setTimeout(function () {
      try {
        // ========== CÁLCULOS ==========

        // Calcula emissão para o modo selecionado
        var emission = (typeof Calculator !== 'undefined' && Calculator.calculateEmission)
          ? Calculator.calculateEmission(distance, selectedMode)
          : null;

        if (emission === null) {
          throw new Error('Falha ao calcular emissão. Verifique os dados.');
        }

        // Calcula emissão do carro como baseline
        var carEmission = (typeof Calculator !== 'undefined' && Calculator.calculateEmission)
          ? Calculator.calculateEmission(distance, 'car')
          : null;

        // Calcula economia (se modo não é carro)
        var savings = null;
        if (selectedMode !== 'car' && carEmission !== null) {
          savings = (typeof Calculator !== 'undefined' && Calculator.calculateSavings)
            ? Calculator.calculateSavings(emission, carEmission)
            : null;
        }

        // Calcula todas as emissões por modo (para comparação)
        var allModes = (typeof Calculator !== 'undefined' && Calculator.calculateAllModes)
          ? Calculator.calculateAllModes(distance)
          : null;

        // Calcula créditos de carbono necessários
        var credits = (typeof Calculator !== 'undefined' && Calculator.calculateCarbonCredits)
          ? Calculator.calculateCarbonCredits(emission)
          : null;

        // Estima preço dos créditos
        var priceEstimate = null;
        if (credits !== null && typeof Calculator !== 'undefined' && Calculator.estimateCreditPrice) {
          priceEstimate = Calculator.estimateCreditPrice(credits);
        }

        // ========== RENDERIZAÇÃO ==========

        // Prepara dados para renderizar resultados
        var resultsData = {
          origin: origin,
          destination: destination,
          distance: distance,
          emission: emission,
          mode: selectedMode,
          savings: savings
        };

        // Renderiza e exibe seção de resultados
        if (typeof UI !== 'undefined' && UI.renderResults) {
          var resultsHtml = UI.renderResults(resultsData);
          var resultsContent = document.getElementById('results-content');
          if (resultsContent) {
            resultsContent.innerHTML = resultsHtml;
          }
          UI.showElement('results');
        }

        // Renderiza e exibe seção de comparação (se data disponível)
        if (allModes && typeof UI !== 'undefined' && UI.renderComparison) {
          var comparisonHtml = UI.renderComparison(allModes, selectedMode);
          var comparisonContent = document.getElementById('comparison-content');
          if (comparisonContent) {
            comparisonContent.innerHTML = comparisonHtml;
          }
          UI.showElement('comparison');
        }

        // Renderiza e exibe seção de créditos (se data disponível)
        if (credits !== null && priceEstimate && typeof UI !== 'undefined' && UI.renderCarbonCredits) {
          var creditsData = {
            credits: credits,
            price: priceEstimate
          };
          var creditsHtml = UI.renderCarbonCredits(creditsData);
          var creditsContent = document.getElementById('carbon-credits-content');
          if (creditsContent) {
            creditsContent.innerHTML = creditsHtml;
          }
          UI.showElement('carbon-credits');
        }

        // Scroll suave até seção de resultados
        if (typeof UI !== 'undefined' && UI.scrollToElement) {
          UI.scrollToElement('results');
        }

        // Remove estado de carregamento
        if (typeof UI !== 'undefined' && UI.hideLoading) {
          UI.hideLoading(submitButton);
        }

      } catch (error) {
        // ========== TRATAMENTO DE ERROS ==========

        // Log para debug
        console.error('Erro ao processar cálculo:', error);

        // Feedback ao usuário
        alert('Ocorreu um erro ao processar o cálculo. Verifique os dados e tente novamente.');

        // Remove estado de carregamento
        if (typeof UI !== 'undefined' && UI.hideLoading) {
          UI.hideLoading(submitButton);
        }
      }
    }, 1500);
  }

  /* ============================================
     GATILHO DE INICIALIZAÇÃO
     ============================================ */

  // Aguarda o DOM estar completamente carregado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM já carregado (se script for carregado de forma assíncrona)
    init();
  }
})();