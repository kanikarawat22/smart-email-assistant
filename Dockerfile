# Use official Java image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy project
COPY . .

# Build the project
RUN ./mvnw clean install -DskipTests

# Run the jar
CMD ["java", "-jar", "target/email-generator-0.0.1-SNAPSHOT.jar"]