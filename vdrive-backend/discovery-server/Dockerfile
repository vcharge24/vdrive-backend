# Multi-stage build for Discovery Server (Eureka)
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file from the build output
COPY target/*.jar app.jar

# Expose the Eureka server port
EXPOSE 8761

# Set health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8761/eureka/apps || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
