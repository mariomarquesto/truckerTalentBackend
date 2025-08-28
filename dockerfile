# Imagen base de Node.js 18 (ligera)
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar todo el código de la app
COPY . .

# Exponer el puerto de la app
EXPOSE 9000

# Comando para iniciar la app
CMD ["node", "server.js"]
