FROM node:16-alpine AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci
CMD npm start

# FROM nginx:alpine 
# COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html 
# EXPOSE 80 
# CMD ["nginx", "-g", "daemon off;"]