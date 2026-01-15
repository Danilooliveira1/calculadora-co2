/*
  js/config.js

  Define um único objeto global: CONFIG

  Conteúdo:
  - CONFIG.EMISSION_FACTORS: kg CO2 por km para cada modo
  - CONFIG.TRANSPORT_MODES: metadados para UI (label, icon, color)
  - CONFIG.CARBON_CREDIT: constantes para créditos de carbono
  - CONFIG.populateDatalist(): popula <datalist id="cities-list"> com cidades a partir de RoutesDB.getAllCities()
  - CONFIG.setupDistanceAutofill(): adiciona listeners a origem/destino e checkbox manual para preencher/editar distância

  Nota: Este arquivo usa a variável global RoutesDB (definida em routes-data.js). Se RoutesDB não existir,
  as funções emitem avisos e não lançam exceções.
*/

var CONFIG = (function () {
  'use strict';

  var EMISSION_FACTORS = {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  };

  var TRANSPORT_MODES = {
    bicycle: { label: 'Bicicleta', icon: '🚲', color: '#2EC4B6' },
    car: { label: 'Carro', icon: '🚗', color: '#0B84A5' },
    bus: { label: 'Ônibus', icon: '🚌', color: '#0B6E9E' },
    truck: { label: 'Caminhão', icon: '🚚', color: '#045B66' }
  };

  var CARBON_CREDIT = {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150
  };

  /* UTILITIES */
  function safeRoutesDB() {
    if (typeof window === 'undefined' || !window.RoutesDB) {
      console.warn('CONFIG: RoutesDB não encontrado. Algumas funcionalidades ficarão limitadas.');
      return null;
    }
    return window.RoutesDB;
  }

  /* Popula o datalist#cities-list com opções obtidas de RoutesDB.getAllCities() */
  function populateDatalist() {
    var db = safeRoutesDB();
    if (!db || typeof db.getAllCities !== 'function') return;

    var cities = db.getAllCities();
    var datalist = document.getElementById('cities-list');
    if (!datalist) {
      console.warn('CONFIG.populateDatalist: datalist #cities-list não encontrado.');
      return;
    }

    // Limpa opções existentes
    while (datalist.firstChild) datalist.removeChild(datalist.firstChild);

    cities.forEach(function (city) {
      var opt = document.createElement('option');
      opt.value = city;
      datalist.appendChild(opt);
    });
  }

  /* Configura preenchimento automático de distância entre origem e destino */
  function setupDistanceAutofill() {
    var originInput = document.getElementById('origin');
    var destinationInput = document.getElementById('destination');
    var distanceInput = document.getElementById('distance');
    var manualCheckbox = document.getElementById('manual-distance');
    var helper = document.getElementById('distance-help');

    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox || !helper) {
      console.warn('CONFIG.setupDistanceAutofill: elementos do formulário não encontrados.');
      return;
    }

    function setHelper(text, color) {
      helper.textContent = text;
      if (typeof color === 'string') {
        helper.style.color = color;
      } else {
        helper.style.color = '';
      }
    }

    function tryFillDistance() {
      var origin = originInput.value.trim();
      var destination = destinationInput.value.trim();

      // Se manual ativado, não sobrescreve
      if (manualCheckbox.checked) {
        setHelper('Inserção manual ativada — você pode editar a distância.', '');
        return;
      }

      if (!origin || !destination) {
        // Se faltando campos, limpa e retorna
        distanceInput.value = '';
        distanceInput.readOnly = true;
        setHelper('A distância será preenchida automaticamente', '');
        return;
      }

      var db = safeRoutesDB();
      if (!db || typeof db.findDistance !== 'function') {
        setHelper('Banco de rotas indisponível — insira distância manualmente', '#E05A5A');
        distanceInput.value = '';
        distanceInput.readOnly = true;
        return;
      }

      var found = db.findDistance(origin, destination);
      if (found !== null && typeof found !== 'undefined') {
        distanceInput.value = Number(found);
        distanceInput.readOnly = true;
        setHelper('Distância encontrada automaticamente: ' + found + ' km', 'green');
      } else {
        distanceInput.value = '';
        distanceInput.readOnly = true;
        setHelper('Distância não encontrada. Marque "inserir distância manualmente" para informar.', '#E05A5A');
      }
    }

    // Listeners
    originInput.addEventListener('change', tryFillDistance);
    destinationInput.addEventListener('change', tryFillDistance);

    manualCheckbox.addEventListener('change', function () {
      if (manualCheckbox.checked) {
        // Permitir edição manual
        distanceInput.readOnly = false;
        distanceInput.focus();
        setHelper('Inserção manual ativada — digite a distância em km.', '');
      } else {
        // Volta a buscar automaticamente
        tryFillDistance();
      }
    });

    // Também tenta preencher ao carregar caso já existam valores
    tryFillDistance();
  }

  /* Inicialização automática ao carregar o DOM */
  function init() {
    if (typeof document === 'undefined') return;
    document.addEventListener('DOMContentLoaded', function () {
      populateDatalist();
      setupDistanceAutofill();
    });
  }

  // Execução imediata do init
  init();

  /* Expor API pública */
  return {
    EMISSION_FACTORS: EMISSION_FACTORS,
    TRANSPORT_MODES: TRANSPORT_MODES,
    CARBON_CREDIT: CARBON_CREDIT,
    populateDatalist: populateDatalist,
    setupDistanceAutofill: setupDistanceAutofill
  };
})();