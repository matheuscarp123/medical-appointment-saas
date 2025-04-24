# MediFlow - Sistema de Agendamento Médico

MediFlow é uma aplicação web moderna para gerenciamento de agendamentos médicos, desenvolvida com React, TypeScript e Material-UI.

## Funcionalidades

- Dashboard interativo com estatísticas e gráficos
- Gerenciamento de médicos e pacientes
- Sistema de agendamento de consultas
- Notificações em tempo real
- Relatórios e análises
- Configurações personalizáveis

## Tecnologias Utilizadas

- React 18
- TypeScript
- Material-UI
- Firebase (Autenticação, Firestore, Storage)
- Recharts (Gráficos)
- React Router v6

## Pré-requisitos

- Node.js 18.12.0 ou superior
- npm 11.2.0 ou superior

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/medical-appointment-saas.git
cd medical-appointment-saas
```

2. Instale as dependências:
```bash
cd frontend
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.development
```
Edite o arquivo `.env.development` com suas configurações do Firebase.

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Estrutura do Projeto

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── config/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── .env.example
├── .env.development
├── .env.production
└── package.json
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm build`: Cria a versão de produção
- `npm test`: Executa os testes
- `npm lint`: Verifica o código com ESLint

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Seu Nome - [@seu-twitter](https://twitter.com/seu-twitter) - email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/medical-appointment-saas](https://github.com/seu-usuario/medical-appointment-saas) 