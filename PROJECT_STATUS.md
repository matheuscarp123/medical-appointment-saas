# MediFlow - Sistema de Agendamento Médico

## Visão Geral
MediFlow é um sistema de agendamento médico SaaS (Software as a Service) desenvolvido com React, TypeScript e Firebase. O sistema permite o gerenciamento de consultas médicas, pacientes, médicos e oferece um assistente de diagnóstico com IA.

## Estado Atual do Projeto

### Estrutura do Projeto
```
medical-appointment-saas/
├── frontend/                  # Aplicação React/TypeScript
│   ├── public/                # Arquivos estáticos
│   │   ├── assets/            # Imagens e recursos
│   │   │   ├── medical-bg.png # Imagem de fundo
│   │   │   └── logo.png.PNG   # Logo do sistema
│   │   ├── index.html         # HTML principal
│   │   ├── manifest.json      # Manifesto PWA
│   │   ├── robots.txt         # Configuração para crawlers
│   │   ├── favicon.svg        # Ícone do site
│   │   └── logo.svg           # Logo em formato SVG
│   ├── src/                   # Código fonte
│   │   ├── components/        # Componentes React
│   │   │   ├── DashboardLayout.tsx  # Layout principal do dashboard
│   │   │   ├── Layout.tsx     # Layout genérico
│   │   │   ├── Navbar.tsx     # Barra de navegação
│   │   │   └── Sidebar.tsx    # Menu lateral
│   │   ├── config/            # Configurações
│   │   │   └── firebase.ts    # Configuração do Firebase
│   │   ├── contexts/          # Contextos React
│   │   │   └── AuthContext.tsx # Contexto de autenticação
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── Home.tsx       # Página inicial
│   │   │   ├── Login.tsx      # Página de login
│   │   │   ├── Dashboard.tsx  # Dashboard principal
│   │   │   ├── Appointments.tsx # Gerenciamento de consultas
│   │   │   ├── Patients.tsx   # Gerenciamento de pacientes
│   │   │   ├── Doctors.tsx    # Gerenciamento de médicos
│   │   │   ├── Settings.tsx   # Configurações
│   │   │   └── DiagnosisAssistant.tsx # Assistente de diagnóstico com IA
│   │   ├── routes/            # Configuração de rotas
│   │   │   └── index.tsx      # Definição de rotas
│   │   ├── services/          # Serviços e APIs
│   │   │   ├── appointmentService.ts # Serviço de consultas
│   │   │   ├── patientService.ts     # Serviço de pacientes
│   │   │   ├── doctorService.ts      # Serviço de médicos
│   │   │   ├── diagnosisService.ts   # Serviço de diagnóstico
│   │   │   └── dashboardService.ts   # Serviço do dashboard
│   │   ├── theme.ts           # Configuração de tema Material-UI
│   │   ├── types/             # Definições de tipos TypeScript
│   │   │   └── entities.ts    # Interfaces de entidades
│   │   ├── App.tsx            # Componente principal
│   │   └── index.tsx          # Ponto de entrada
│   ├── package.json           # Dependências e scripts
│   └── tsconfig.json          # Configuração TypeScript
└── README.md                  # Documentação principal
```

### Funcionalidades Implementadas

#### Autenticação
- Login com Google (Firebase Authentication)
- Gerenciamento de sessão de usuário
- Proteção de rotas privadas

#### Interface do Usuário
- Design responsivo com Material-UI
- Tema personalizado com cores e estilos consistentes
- Layout de dashboard com sidebar e navbar
- Página inicial com seções de recursos e assistente de IA

#### Dashboard
- Visão geral com métricas principais
- Gráficos de agendamentos e distribuição de pacientes
- Lista de consultas recentes
- Notificações de eventos importantes

#### Gerenciamento de Consultas
- Agendamento de consultas
- Reagendamento de consultas
- Visualização de histórico
- Status de consultas (agendada, em andamento, concluída, cancelada)

#### Gerenciamento de Pacientes
- Cadastro de pacientes
- Histórico médico
- Perfil detalhado

#### Assistente de Diagnóstico com IA
- Análise de sintomas
- Sugestões de diagnóstico
- Histórico de diagnósticos

#### Segurança
- Criptografia de dados
- Conformidade com LGPD
- Autenticação de dois fatores
- Backups automáticos

### Tecnologias Utilizadas
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Firebase (Firestore, Authentication)
- **Gráficos**: Recharts
- **Formulários**: React Hook Form
- **Data**: date-fns
- **Roteamento**: React Router

### Próximos Passos
1. Implementar testes automatizados
2. Adicionar funcionalidade de pagamentos
3. Melhorar a integração com o assistente de IA
4. Implementar sistema de relatórios avançados
5. Adicionar suporte a múltiplos idiomas
6. Otimizar performance e carregamento

## Instruções para Continuidade

### Configuração do Ambiente
1. Clone o repositório
2. Instale as dependências: `cd frontend && npm install`
3. Configure as variáveis de ambiente do Firebase
4. Inicie o servidor de desenvolvimento: `npm start`

### Estrutura de Dados
O sistema utiliza as seguintes coleções no Firestore:
- `appointments`: Consultas médicas
- `patients`: Dados dos pacientes
- `doctors`: Dados dos médicos
- `users`: Usuários do sistema
- `diagnosis`: Sugestões de diagnóstico

### Convenções de Código
- Componentes React: PascalCase (ex: `DashboardLayout.tsx`)
- Funções e variáveis: camelCase (ex: `handleReschedule`)
- Interfaces e tipos: PascalCase (ex: `Appointment`)
- Arquivos de serviço: camelCase (ex: `appointmentService.ts`)

### Fluxo de Desenvolvimento
1. Crie uma branch para a nova funcionalidade
2. Implemente as alterações seguindo as convenções de código
3. Teste localmente
4. Crie um pull request para revisão

## Contato
Para mais informações sobre o projeto, entre em contato com a equipe de desenvolvimento. 