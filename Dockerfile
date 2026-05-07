# 1. AŞAMA: Derleme (Build)
FROM node:20-slim AS builder
WORKDIR /app

# Kök dizindeki paket dosyalarını kopyala
COPY package*.json ./
# Kütüphane kaynak kodlarını ve tsconfig'i kopyala
COPY src ./src
COPY tsconfig.json ./

# Kütüphane bağımlılıklarını kur ve kütüphaneyi derle
RUN npm install --legacy-peer-deps
RUN npm run build

# Uygulama dizinine (examples/console) geçelim
COPY examples/console/package*.json ./examples/console/
WORKDIR /app/examples/console

# Uygulama bağımlılıklarını kur 
# (Burada file:../.. referansı artık Docker içindeki derlenmiş kütüphaneyi görecektir)
RUN npm install --legacy-peer-deps

# Uygulama dosyalarını kopyala ve build al
WORKDIR /app
COPY examples/console ./examples/console
WORKDIR /app/examples/console
RUN npm run build

# 2. AŞAMA: Çalıştırma (Runner)
FROM node:20-slim AS runner
WORKDIR /app

# Sadece çalışması için gereken dosyaları builder aşamasından kopyala
COPY --from=builder /app/examples/console/.next ./examples/console/.next
COPY --from=builder /app/examples/console/node_modules ./examples/console/node_modules
COPY --from=builder /app/examples/console/package.json ./examples/console/package.json
COPY --from=builder /app/examples/console/public ./examples/console/public

# Çalışma dizinini uygulamanın içine çek
WORKDIR /app/examples/console

ENV NODE_ENV=production
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "run", "start"]