/*
  js/calculator.js

  Define um único objeto global: Calculator

  Métodos:
    - calculateEmission(distanceKm, transportMode)
    - calculateAllModes(distanceKm)
    - calculateSavings(emission, baselineEmission)
    - calculateCarbonCredits(emissionKg)
    - estimateCreditPrice(credits)

  Observações:
    - As funções usam valores de CONFIG (EMISSION_FACTORS e CARBON_CREDIT).
    - As funções validam entradas básicas e retornam `null` quando dados inválidos são fornecidos.
*/

var Calculator = (function () {
  'use strict';

  function round(value, decimals) {
    var factor = Math.pow(10, decimals);
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  }

  /**
   * Calcula a emissão (kg CO2) para uma distância e modo de transporte.
   * Formula: emission = distanceKm * factor
   * Retorna número arredondado para 2 casas decimais ou null se entrada inválida.
   */
  function calculateEmission(distanceKm, transportMode) {
    var dist = Number(distanceKm);
    if (!isFinite(dist) || dist < 0) return null;
    if (!window.CONFIG || !CONFIG.EMISSION_FACTORS) return null;
    var factor = CONFIG.EMISSION_FACTORS[transportMode];
    if (typeof factor !== 'number' || !isFinite(factor)) return null;

    var emission = dist * factor;
    return round(emission, 2);
  }

  /**
   * Calcula emissões para todos os modos definidos em CONFIG.EMISSION_FACTORS.
   * Para cada modo retorna: { mode, emission, percentageVsCar }
   * - percentageVsCar = (emission / carEmission) * 100
   * Ordena o array por emissões (menor primeiro) antes de retornar.
   */
  function calculateAllModes(distanceKm) {
    var dist = Number(distanceKm);
    if (!isFinite(dist) || dist < 0) return null;
    if (!window.CONFIG || !CONFIG.EMISSION_FACTORS) return null;

    var factors = CONFIG.EMISSION_FACTORS;
    var modes = Object.keys(factors);

    var carEmission = null;
    if (modes.indexOf('car') !== -1) {
      carEmission = dist * factors['car'];
    }

    var results = modes.map(function (mode) {
      var emission = dist * factors[mode];
      var emissionRounded = round(emission, 2);

      var percentageVsCar = null;
      if (carEmission !== null && carEmission !== 0) {
        percentageVsCar = round((emission / carEmission) * 100, 2);
      }

      return {
        mode: mode,
        emission: emissionRounded,
        percentageVsCar: percentageVsCar
      };
    });

    // Ordena por emission ascendente
    results.sort(function (a, b) {
      return a.emission - b.emission;
    });

    return results;
  }

  /**
   * Calcula a economia entre uma emissão e uma baseline (ambas em kg).
   * Retorna objeto: { savedKg, percentage }
   * - savedKg = baseline - emission
   * - percentage = (savedKg / baseline) * 100
   * Valores arredondados para 2 casas; se baseline for zero, percentage = null
   */
  function calculateSavings(emission, baselineEmission) {
    var e = Number(emission);
    var b = Number(baselineEmission);
    if (!isFinite(e) || !isFinite(b)) return null;

    var saved = b - e;
    var savedKg = round(saved, 2);

    var percentage = null;
    if (b !== 0) {
      percentage = round((saved / b) * 100, 2);
    }

    return { savedKg: savedKg, percentage: percentage };
  }

  /**
   * Converte emissões (kg) em créditos de carbono (unidades), onde 1 crédito = CONFIG.CARBON_CREDIT.KG_PER_CREDIT.
   * Retorna número arredondado para 4 casas decimais.
   */
  function calculateCarbonCredits(emissionKg) {
    var e = Number(emissionKg);
    if (!isFinite(e) || e < 0) return null;
    if (!window.CONFIG || !CONFIG.CARBON_CREDIT) return null;

    var per = Number(CONFIG.CARBON_CREDIT.KG_PER_CREDIT);
    if (!isFinite(per) || per <= 0) return null;

    var credits = e / per;
    return round(credits, 4);
  }

  /**
   * Estima preço para uma quantidade de créditos: retorna { min, max, average }
   * - min = credits * PRICE_MIN_BRL
   * - max = credits * PRICE_MAX_BRL
   * - average = (min + max) / 2
   * Valores arredondados para 2 casas.
   */
  function estimateCreditPrice(credits) {
    var c = Number(credits);
    if (!isFinite(c) || c < 0) return null;
    if (!window.CONFIG || !CONFIG.CARBON_CREDIT) return null;

    var minP = Number(CONFIG.CARBON_CREDIT.PRICE_MIN_BRL);
    var maxP = Number(CONFIG.CARBON_CREDIT.PRICE_MAX_BRL);
    if (!isFinite(minP) || !isFinite(maxP)) return null;

    var min = round(c * minP, 2);
    var max = round(c * maxP, 2);
    var avg = round((min + max) / 2, 2);

    return { min: min, max: max, average: avg };
  }

  // API pública
  return {
    calculateEmission: calculateEmission,
    calculateAllModes: calculateAllModes,
    calculateSavings: calculateSavings,
    calculateCarbonCredits: calculateCarbonCredits,
    estimateCreditPrice: estimateCreditPrice
  };
})();