# Используем официальный Node.js образ
FROM node:20-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production-зависимости
RUN npm install --production

# Копируем все остальные файлы проекта
COPY . .

# Собираем TypeScript в dist
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
