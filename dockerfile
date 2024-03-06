FROM node:20-alpine as builder
WORKDIR '/app'
COPY    package.json .

RUN     npm install

COPY    . .
RUN	npm run build
# npm run build erstellt den Ordner /app/build <-- enthält alles was für den Productionserver nötig ist

# Step2: Run Phase 
# ein weiteres FROM deklariert automatisch den obigen Block als beendet
FROM nginx:stable
# kopieren aus der builder Phase in das stammverzeichnis des nginx Servers
COPY --from=builder /app/build  /usr/share/nginx/html
