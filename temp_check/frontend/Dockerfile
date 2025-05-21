FROM node:18-alpine as builder

WORKDIR /app

# Copiar os arquivos de configuração de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar o código fonte
COPY . .

# Criar build de produção
RUN npm run build

# Configuração para produção com Nginx
FROM nginx:alpine

# Copiar a build do estágio anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar a configuração personalizada do Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"] 