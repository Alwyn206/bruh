# Use Maven with OpenJDK 17 for build stage
FROM maven:3.8.6-openjdk-17-slim AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml ./

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use OpenJDK 17 for runtime
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/hackmate-backend-0.0.1-SNAPSHOT.jar app.jar

# Create logs directory
RUN mkdir -p /app/logs

# Expose port (Render will set PORT environment variable)
EXPOSE $PORT

# Set JVM options
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application with dynamic port
CMD ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]