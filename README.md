# Sistema de Agendamento de Consultas Médicas

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18.3-black.svg)](https://expressjs.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.10-blue.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Um aplicativo web moderno para gerenciar consultas médicas, construído com uma arquitetura de microserviços.

## 🚀 Demonstração

Acesse a versão implantada do aplicativo: [https://matheuscarp123.github.io/medical-appointment-saas/](https://matheuscarp123.github.io/medical-appointment-saas/)

## 📋 Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Configuração para Desenvolvimento](#configuração-para-desenvolvimento)
- [Implantação](#implantação)
- [Endpoints da API](#endpoints-da-api)
- [Recursos de Segurança](#recursos-de-segurança)
- [Testes](#testes)
- [Melhorias Futuras](#melhorias-futuras)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

## 🛠️ Tecnologias Utilizadas

### Frontend (Parte Visual)
- **Framework**: React 18.2.0 (biblioteca para criar interfaces)
- **Linguagem**: TypeScript 4.9.5 (JavaScript com verificação de tipos)
- **Biblioteca de Interface**: Material-UI v5.15.10 (componentes visuais prontos)
- **Gerenciamento de Estado**: React Hooks (gerenciamento de dados)
- **Formulários**: Formik 2.4.5 com validação Yup 1.3.3
- **Navegação**: React Router v6.22.1 (navegação entre páginas)
- **Requisições HTTP**: Axios 1.6.7 (comunicação com o servidor)
- **Manipulação de Datas**: date-fns 2.30.0
- **Ferramenta de Construção**: Create React App (CRA)
- **Gerenciador de Pacotes**: npm

### Backend (Parte do Servidor)
- **Ambiente de Execução**: Node.js
- **Framework**: Express.js 4.18.3 (servidor web)
- **Linguagem**: TypeScript
- **Banco de Dados**: MongoDB com Mongoose (armazenamento de dados)
- **Autenticação**: JWT (tokens para login seguro)
- **Segurança**: bcryptjs para criptografia de senhas
- **Documentação da API**: OpenAPI/Swagger
- **Gerenciador de Pacotes**: npm

## 🏗️ Arquitetura

### Arquitetura do Frontend
- Arquitetura baseada em componentes usando React
- Design responsivo usando Material-UI
- Navegação no lado do cliente com React Router
- Validação de formulários usando Formik e Yup
- Integração com API RESTful usando Axios
- Desenvolvimento com verificação de tipos usando TypeScript

### Arquitetura do Backend
- Design de API RESTful
- Padrão MVC (Modelo-Visão-Controlador)
- Processamento de requisições baseado em middleware
- Autenticação baseada em JWT
- MongoDB para persistência de dados
- TypeScript para segurança de tipos

## ✨ Funcionalidades
- Autenticação e autorização de usuários
- Agendamento e gerenciamento de consultas
- Verificação de disponibilidade em tempo real
- Perfis de pacientes e médicos
- Histórico de consultas
- Notificações por e-mail (planejado)
- Design responsivo para todos os dispositivos

## ⚙️ Configuração para Desenvolvimento

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- MongoDB (local ou Atlas)

### Configuração do Frontend
```bash
cd frontend
npm install
npm start
```

### Configuração do Backend
```bash
cd backend
npm install
npm run dev
```

## 🚀 Implantação
- Frontend: Implantado no GitHub Pages
- Backend: Pronto para implantação em várias plataformas (Heroku, Railway, etc.)

## 🔌 Endpoints da API
- `/api/auth` - Endpoints de autenticação
- `/api/appointments` - Gerenciamento de consultas
- `/api/users` - Gerenciamento de usuários
- `/api/doctors` - Perfis e disponibilidade de médicos

## 🔒 Recursos de Segurança
- Autenticação baseada em JWT
- Criptografia de senhas com bcrypt
- Proteção CORS
- Configuração de variáveis de ambiente
- Validação e sanitização de entrada de dados

## 🧪 Testes
- Frontend: React Testing Library
- Backend: Jest
- Testes de API: Postman/Insomnia

## 🔮 Melhorias Futuras
- Notificações em tempo real usando WebSocket
- Integração de pagamentos
- Funcionalidade de consulta por vídeo
- Aplicativo móvel
- Painel de análise avançada

## 🤝 Como Contribuir
1. Faça um fork do repositório
2. Crie sua branch de recurso
3. Faça commit das suas alterações
4. Envie para a branch
5. Crie um Pull Request

## 📄 Licença
Licença MIT 