FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests \
 && mvn -q dependency:copy -Dartifact=org.postgresql:postgresql:42.7.4 -DoutputDirectory=/app/jdbc

FROM icr.io/appcafe/open-liberty:kernel-slim-java21-openj9-ubi-minimal
COPY --chown=1001:0 src/main/liberty/config/server.xml /config/
RUN features.sh
COPY --chown=1001:0 --from=build /app/jdbc/ /config/jdbc/
COPY --chown=1001:0 --from=build /app/target/web_lab_3.war /config/apps/
RUN configure.sh
