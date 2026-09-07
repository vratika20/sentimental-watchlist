FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml ./
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java -Dserver.address=0.0.0.0 -Dserver.port=${PORT:-8080} -jar /app/app.jar"]