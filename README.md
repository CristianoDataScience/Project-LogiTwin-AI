# 🚚 LogiTwin AI - Digital Twin Logístico de Alta Performance

![Status](https://img.shields.io/badge/Status-Concluído-success)
![AI](https://img.shields.io/badge/AI-OpenAI%20GPT--4o-blue)
![Design](https://img.shields.io/badge/Design-Premium%20Glassmorphism-purple)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20SQLite-orange)

**LogiTwin AI** é uma plataforma de "Gêmeo Digital" (Digital Twin) de próxima geração para operações logísticas. Combinando monitoramento em tempo real, fidelidade geográfica e inteligência artificial generativa, o sistema oferece uma visão holística e preditiva de toda a cadeia de suprimentos.

---

## ✨ Novidades e Melhorias

### 🎨 Experiência Premium (Glassmorphism)
- **Interface Futurista**: Telas de Login e Registro totalmente redesenhadas com estética Glassmorphism, transparências e micro-animações.
- **Visual Profissional**: Uso de paletas de cores modernas e tipografia de alta legibilidade.

### 🗺️ Precisão Geográfica e Visual
- **Rotas Realistas**: Trajetos que seguem rigorosamente as rodovias brasileiras (ex: Via Dutra para o trecho SP-RJ), evitando o mar e terrenos inacessíveis.
- **Frota Profissional**: Substituição de ícones genéricos por modelos de **Semi-Trucks** (caminhões pesados) com popups de status detalhados.

### 📋 Central de Cadastros Robusta
- **Gestão de Ativos**: Cadastro completo de novos veículos com validação de placa e capacidade.
- **Gestão de Equipe**: Registro de colaboradores com distinção de cargos (Motoristas, Operadores, Gerentes).

---

## 🚀 Funcionalidades Principais

### 1. 🧠 Inteligência Artificial Tática (GenAI)
- **Integração OpenAI GPT-4o**: Análise profunda de cenários de crise.
- **Simulação de Impacto**: Teste variáveis climáticas (Tempestades) e de tráfego para prever gargalos.
- **Ações Sugeridas**: Recomendações em tempo real para mitigar atrasos e otimizar rotas.

### 2. 📊 Dashboard de Operações
- **KPIs em Tempo Real**: Monitoramento de pedidos atrasados, risco operacional e custo de atraso.
- **Visão 360°**: Acompanhamento desde o Centro de Distribuição até a entrega final ao cliente.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **ReactJS (Vite)** + **TailwindCSS**: Velocidade e design state-of-the-art.
- **Leaflet**: Mapas interativos com camadas inteligentes.
- **Lucide React**: Iconografia moderna.

### Backend
- **Python (FastAPI)**: API assíncrona de alto desempenho.
- **SQLAlchemy + SQLite**: Persistência de dados robusta e eficiente.
- **OpenAI SDK**: O cérebro por trás das decisões automatizadas.

---

## ⚙️ Instalação e Execução

### 1. Configurar o Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
# Crie um arquivo .env com OPENAI_API_KEY=sua-chave
uvicorn main:app --reload
```

### 2. Configurar o Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Acesso Padrão
- **Usuário**: `admin@logistics.com`
- **Senha**: `admin123`

---

Desenvolvido para demonstrar o poder da **IA Generativa aplicada à Logística Moderna**.
