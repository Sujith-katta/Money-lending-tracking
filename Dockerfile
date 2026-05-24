# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY public public
COPY src/App.js src/index.js src/index.css src/
COPY src/components src/components
COPY src/services src/services

ENV REACT_APP_API_URL=/api
RUN npm run build

# Stage 2: Build Spring Boot application
FROM eclipse-temurin:21-jdk-jammy AS backend-builder

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

COPY --from=frontend-builder /app/build ./src/main/resources/static

RUN chmod +x mvnw && ./mvnw -B -DskipTests package

# Stage 3: Runtime image
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=backend-builder /app/target/Lending-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
