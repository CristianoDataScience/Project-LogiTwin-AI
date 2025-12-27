# 🚚 LogiTwin AI - Digital Twin Logístico com Inteligência Artificial

![Status](https://img.shields.io/badge/Status-Concluído-success)
![AI](https://img.shields.io/badge/AI-OpenAI%20GPT--4o-blue)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20SQLite-orange)

**LogiTwin AI** é uma plataforma avançada de "Gêmeo Digital" (Digital Twin) para operações logísticas. O sistema funciona como um "Waze + Simulador" corporativo, permitindo monitorar frotas em tempo real e simular cenários de crise (tempestades, tráfego intenso) utilizando **Inteligência Artificial Generativa** para propor soluções táticas.

---

## 🚀 Funcionalidades Principais

### 1. 🗺️ Monitoramento em Tempo Real
- **Mapa Interativo**: Visualização de Centros de Distribuição (CDs), caminhões e rotas ativas.
- **Ícones Personalizados**: Identificação visual clara de status (Em Trânsito, Parado, Manutenção).
- **Rastreamento de Frota**: Dados detalhados de cada veículo (Placa, Carga, Destino).

### 2. 🧠 Motor de Simulação com IA (GenAI)
- **Integração OpenAI GPT-4o**: O sistema não usa apenas regras fixas; ele consulta uma IA avançada para analisar cenários.
- **Simulação de Cenários**: Teste o impacto de variáveis como:
    - ⛈️ **Clima**: Claro, Chuva, Tempestade.
    - 🚦 **Tráfego**: Normal até 2x mais intenso.
- **Recomendações Táticas**: A IA analisa os atrasos previstos e gera 3 recomendações em linguagem natural (ex: *"Redirecionar caminhão X pela rota sul para evitar bloqueio na via Dutra"*).

### 3. 📊 Gestão Operacional
- **Dashboard de KPIs**: Métricas vitais como Caminhões Ativos, Total de Pedidos e Gargalos.
- **Gestão de Pedidos**: Acompanhamento de status (Pendente, Atribuído, Entregue) com dados de clientes.
- **Localização Completa**: Interface e dados 100% em Português do Brasil (PT-BR).

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **ReactJS (Vite)**: Performance e componentização moderna.
- **TailwindCSS**: Estilização responsiva e design system limpo.
- **Leaflet**: Mapas interativos e leves.
- **Lucide React**: Ícones modernos e consistentes.
- **Axios**: Comunicação com API e interceptação de erros (ex: Auth Token).

### Backend
- **Python (FastAPI)**: Alta performance para APIs assíncronas.
- **SQLAlchemy + SQLite**: ORM robusto e banco de dados leve (zero-config).
- **OpenAI SDK**: Conexão com modelos GPT para inteligência do sistema.
- **Faker (PT-BR)**: Geração de dados de teste realistas e localizados.
- **JWT (JSON Web Tokens)**: Autenticação segura.

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Python 3.9+
- Node.js 16+
- Uma chave de API da OpenAI (para funcionalidades de IA).

### 1. Configurar o Backend

```bash
# Entre na pasta do backend
cd backend

# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure a chave da OpenAI
# Crie um arquivo .env na pasta backend e adicione:
# OPENAI_API_KEY=sua-chave-aqui

# Inicie o servidor
uvicorn main:app --reload
```
*O servidor rodará em: `http://localhost:8000`*

### 2. Configurar o Frontend

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
*O frontend rodará em: `http://localhost:5173`*

---

## 🔐 Acesso ao Sistema

Para acessar todas as funcionalidades, utilize as credenciais de administrador padrão geradas pelo sistema:

- **Login**: `admin@logistics.com`
- **Senha**: `admin123`

---

## 🧪 Como Testar a IA

1. Faça login no sistema.
2. Navegue até a aba **Simulação** no menu lateral.
3. Altere as configurações:
    - Mude o Clima para **Tempestade**.
    - Aumente a Intensidade do Tráfego para **2.0x**.
4. Clique em **Executar Simulação**.
5. Aguarde enquanto o sistema calcula os atrasos e consulta o GPT-4o.
6. Leia as **Recomendações da IA** geradas especificamente para o cenário criado.

---

## 📂 Estrutura do Projeto

```
projecto_twin_ia_logistic/
├── backend/
│   ├── main.py           # Ponto de entrada da API
│   ├── simulation.py     # Lógica de Simulação + Integração OpenAI
│   ├── models.py         # Tabelas do Banco de Dados
│   ├── mock_data.py      # Gerador de dados PT-BR
│   └── logistics.db      # Banco de dados SQLite
├── frontend/
│   ├── src/
│   │   ├── components/   # Sidebar, MapComponent, etc.
│   │   ├── pages/        # Dashboard, Simulation, Fleet, etc.
│   │   └── api.js        # Configuração do Axios
└── README.md
```

---

Desenvolvido para fins de demonstração de capacidades de **IA Generativa aplicada à Logística**.
