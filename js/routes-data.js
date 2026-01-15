/*
  js/routes-data.js

  Define um único objeto global: RoutesDB

  Estrutura:
  - RoutesDB.routers: Array de objetos { origin: string, destination: string, distanceKm: number }
    * origin/destination usam formato: "Cidade, UF" (ex.: "São Paulo, SP")
  - RoutesDB.getAllCities(): retorna array único e ordenado alfabeticamente de todas as cidades presentes nas rotas
  - RoutesDB.findDistance(origin, destination): procura distância entre duas cidades (busca bidirecional), normaliza entradas (trim + lowercase) e retorna distância em km ou null se não encontrar

  Observações:
  - Este arquivo adiciona apenas a variável global `RoutesDB` ao escopo global (window em browsers).
  - As distâncias são aproximadas e servem como base para preenchimento automático e testes.
*/

var RoutesDB = (function () {
  'use strict';

  var routers = [
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },

    /* Regionais e conexões importantes */
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
    { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
    { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKm: 260 },
    { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },
    { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKm: 110 },
    { origin: "Fortaleza, CE", destination: "Sobral, CE", distanceKm: 240 },
    { origin: "Manaus, AM", destination: "Santarém, PA", distanceKm: 670 },
    { origin: "Belém, PA", destination: "Ananindeua, PA", distanceKm: 20 },
    { origin: "Recife, PE", destination: "Olinda, PE", distanceKm: 10 },
    { origin: "João Pessoa, PB", destination: "Campina Grande, PB", distanceKm: 120 },
    { origin: "Natal, RN", destination: "Mossoró, RN", distanceKm: 210 },
    { origin: "Vitória, ES", destination: "Vila Velha, ES", distanceKm: 10 },
    { origin: "Goiânia, GO", destination: "Anápolis, GO", distanceKm: 55 },
    { origin: "Campo Grande, MS", destination: "Dourados, MS", distanceKm: 220 },
    { origin: "Cuiabá, MT", destination: "Rondonópolis, MT", distanceKm: 220 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 200 },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 80 },
    { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 320 },
    { origin: "Salvador, BA", destination: "Ilhéus, BA", distanceKm: 270 },
    { origin: "Porto Alegre, RS", destination: "Caxias do Sul, RS", distanceKm: 130 },
    { origin: "Curitiba, PR", destination: "Londrina, PR", distanceKm: 370 },
    { origin: "Fortaleza, CE", destination: "Juazeiro do Norte, CE", distanceKm: 500 },
    { origin: "Recife, PE", destination: "Maceió, AL", distanceKm: 250 },
    { origin: "Manaus, AM", destination: "Belém, PA", distanceKm: 1480 },
    { origin: "São Paulo, SP", destination: "Porto Alegre, RS", distanceKm: 1130 },
    { origin: "São Paulo, SP", destination: "Salvador, BA", distanceKm: 1540 },
    { origin: "São Paulo, SP", destination: "Recife, PE", distanceKm: 2650 },
    { origin: "Belo Horizonte, MG", destination: "São Paulo, SP", distanceKm: 586 },
    { origin: "Curitiba, PR", destination: "São Paulo, SP", distanceKm: 408 },
    { origin: "Vitória, ES", destination: "Rio de Janeiro, RJ", distanceKm: 520 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
    { origin: "Belém, PA", destination: "Santarém, PA", distanceKm: 680 }
  ];

  function normalizeCity(name) {
    if (typeof name !== 'string') return '';
    return name.trim().toLowerCase();
  }

  function getAllCities() {
    var set = {};
    routers.forEach(function (r) {
      set[r.origin] = true;
      set[r.destination] = true;
    });
    var cities = Object.keys(set);
    // Ordena alfabeticamente respeitando acentuação PT-BR
    cities.sort(function (a, b) {
      return a.localeCompare(b, 'pt-BR');
    });
    return cities;
  }

  function findDistance(origin, destination) {
    var o = normalizeCity(origin);
    var d = normalizeCity(destination);
    if (!o || !d) return null;

    for (var i = 0; i < routers.length; i++) {
      var r = routers[i];
      if (normalizeCity(r.origin) === o && normalizeCity(r.destination) === d) {
        return r.distanceKm;
      }
      if (normalizeCity(r.origin) === d && normalizeCity(r.destination) === o) {
        return r.distanceKm;
      }
    }

    return null;
  }

  // Expose the public API
  return {
    routers: routers,
    getAllCities: getAllCities,
    findDistance: findDistance
  };
})();