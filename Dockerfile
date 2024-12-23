# Stage 1: Build the React App
FROM node:alpine as build

WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Stage 2: Serve the App with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]