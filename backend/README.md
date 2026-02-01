# JustTalk Backend

This is the backend server for the JustTalk project, built with Spring Boot.

## Getting Started

First, run the backend server:

```bash
./mvnw spring-boot:run
# or (on Windows)
.\mvnw.cmd spring-boot:run
```
 
For Linux/Mac:
If error recieved is "zsh: permission denied: ./mvnw" then write the command chmod +x mvnw which changes the execution permissions for the mvnw file

The server will start and listen on the configured port (default is 8080).

## Project Structure

- `src/main/java/justtalk/demo/` - Main Java source code
- `src/main/resources/` - Application properties and resources
- `src/test/java/justtalk/demo/` - Test code
- `pom.xml` - Maven project configuration

## Learn More

To learn more about Spring Boot and Maven, check out:

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Maven Documentation](https://maven.apache.org/guides/index.html)

## API Endpoints

The backend exposes REST API endpoints for session and video management. See the controller classes in `src/main/java/justtalk/demo/controller/` for details.

---

For any issues or contributions, please refer to the repository guidelines.