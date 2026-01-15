# 🌍 Calculadora de Emissão de CO₂

Uma aplicação web interativa e responsiva projetada para calcular a pegada de carbono de diferentes trajetos e modos de transporte. O projeto visa conscientizar sobre o impacto ambiental dos deslocamentos, oferecendo comparativos visuais e estimativas de compensação via créditos de carbono.

> **Nota:** Este projeto foi desenvolvido utilizando a metodologia *Vibe Coding* com auxílio do GitHub Copilot para aceleração do desenvolvimento e sugestão de estilos.

## ✨ Funcionalidades

* **📍 Rotas Inteligentes:**
    * Banco de dados interno com distâncias pré-definidas entre principais cidades brasileiras (ex: São Paulo, Rio de Janeiro, Brasília, etc.).
    * Preenchimento automático da distância ao selecionar origem e destino compatíveis.
* **📏 Entrada Flexível:**
    * Opção de inserção manual da distância (em km) caso a rota não esteja mapeada.
* **🚗 Múltiplos Modos de Transporte:**
    * Suporte para Bicicleta (Emissão Zero), Carro, Ônibus e Caminhão.
    * Fatores de emissão calibrados especificamente para cada veículo.
* **📊 Comparativo Visual:**
    * Exibe gráficos de barra comparando a emissão do modo escolhido com as alternativas.
    * Destaca a economia de CO₂ gerada ao optar por transportes mais limpos.
* **💰 Créditos de Carbono:**
    * Calcula quantos créditos de carbono seriam necessários para compensar a viagem.
    * Fornece uma estimativa de custo em Reais (R$) para essa compensação.
* **📱 Design Responsivo:**
    * Interface moderna, limpa e adaptável a dispositivos móveis e desktops.
    * Feedback visual de carregamento e validação de formulários.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído seguindo os princípios da **Web Standard**, sem dependência de frameworks pesados, garantindo alta performance e leveza.

* **HTML5 Semântico:** Estrutura acessível e organizada.
* **CSS3 (BEM & Variables):** Estilização modular utilizando a convenção BEM (*Block Element Modifier*) e variáveis CSS para paleta de cores e responsividade.
* **JavaScript (Vanilla ES5/ES6):** Arquitetura baseada em módulos IIFE (*Immediately Invoked Function Expressions*) para evitar poluição do escopo global e garantir segurança.

## 📂 Estrutura do Projeto

Para que o projeto funcione corretamente, organize os arquivos nas pastas conforme a árvore abaixo:

```text
/
├── index.html          # Página principal
├── css/
│   └── style.css       # Folha de estilos
└── js/
    ├── routes-data.js  # Base de dados de rotas e cidades
    ├── config.js       # Configurações globais (fatores e preços)
    ├── calculator.js   # Lógica de cálculo de emissão e finanças
    ├── ul.js           # Lógica de Interface (UI) e renderização
    └── app.js          # Controlador principal e eventos
```
## 🚀 Como Executar

Como este é um projeto estático (*front-end* puro), não é necessária a instalação de dependências ou configuração de servidores complexos.

1.  **Baixe ou Clone o repositório:**
    ```bash
    git clone https://github.com/Danilooliveira1/calculadora-co2.git
    ```

2.  **Verifique a organização das pastas:**
    Para o funcionamento correto, certifique-se de que a estrutura de arquivos esteja organizada da seguinte forma (conforme referenciado no `index.html`):
    * Os arquivos `.js` devem estar dentro da pasta `js/`.
    * O arquivo `style.css` deve estar dentro da pasta `css/`.

3.  **Execute:**
    Basta abrir o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Firefox, Edge, Safari).

## 🧠 Lógica de Cálculo

Os cálculos são realizados no *front-end* (arquivo `js/calculator.js`) e baseiam-se em fatores de emissão médios configurados em `js/config.js`:

| Modo de Transporte | Fator de Emissão (kg CO₂/km) |
| :--- | :---: |
| 🚲 **Bicicleta** | **0.00** |
| 🚌 **Ônibus** | **0.089** |
| 🚗 **Carro** | **0.12** |
| 🚚 **Caminhão** | **0.96** |

* **Economia:** Calculada pela diferença entre a emissão do carro (referência) e o modo escolhido (ex: Ônibus ou Bicicleta).
* **Créditos de Carbono:** Considera-se que **1 crédito** equivale a **1 tonelada métrica (1.000 kg)** de CO₂.
* **Estimativa de Custo:** O preço do crédito é estimado dinamicamente entre **R$ 50,00** e **R$ 150,00** por unidade.

## 🎨 Layout e Design

A interface foi construída com CSS puro (sem frameworks), utilizando a metodologia BEM e Variáveis CSS para facilitar a manutenção. A paleta de cores foi escolhida para evocar natureza e tecnologia limpa:

* **Cor Primária:** Azul Esverdeado (`#0B84A5`) - Usada em botões e destaques principais.
* **Cor de Acento:** Verde Água (`#2EC4B6`) - Usada para indicar ações positivas e economia.
* **Fundo:** Gradiente suave de azul (`#D9F1F6` a `#BEE6EC`) para conforto visual.

---

*Projeto criado para fins de estudo e conscientização ambiental*

**Desenvolvido por Danilooliveira1**
