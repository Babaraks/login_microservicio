# Usa una imagen de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto (ajústalo si usas otro)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]