# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
# Copy only the pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline
# Copy the source code and build the jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar
# Expose the port your Spring Boot app runs on
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]