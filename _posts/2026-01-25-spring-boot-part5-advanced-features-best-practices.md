---
layout: post
title: "⚡ Spring Boot Development Series - Part 5: Advanced Features and Best Practices"
categories: [Spring Boot, Java, Tutorial]
description: "Explore testing, configuration, and deployment to wrap up your Spring Boot mastery."
excerpt: "Add unit tests, configure properties, and deploy your app with best practices."
series: "Spring Boot Development Series"
part: 5
---

# Spring Boot Development Series - Part 5: Advanced Features and Best Practices

Wrapping up our series ([Part 1](2026-01-21-spring-boot-part1-introduction-maven-setup.md) to [Part 4](2026-01-24-spring-boot-part4-building-first-application.md)), this post covers advanced topics: testing, configuration, and deployment. These ensure production-ready apps.

## Testing with JUnit and Spring Boot Test

Testing validates code. Spring Boot integrates JUnit 5.

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

Example test for UserService:
```java
@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;

    @Test
    public void testGetAllUsers() {
        List<User> users = userService.getAllUsers();
        assertNotNull(users);
    }
}
```

Run with `mvn test`. The YouTube video covers testing from 45:00-55:00.

## Configuration with application.properties

Externalize settings in `src/main/resources/application.properties`:
```properties
server.port=8081
app.name=My Spring Boot App
```

Access in code:
```java
@Value("${app.name}")
private String appName;
```

For complex configs, use `@ConfigurationProperties`.

## Deployment Best Practices

### Building a JAR
Run `mvn clean package` to create `target/demo-0.0.1-SNAPSHOT.jar`.

### Running the JAR
`java -jar target/demo-0.0.1-SNAPSHOT.jar`

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build and run: `docker build -t demo .` then `docker run -p 8080:8080 demo`.

The video's deployment section is from 55:00-end.

## Best Practices Recap
- Use constructor DI.
- Write tests first.
- Externalize configs.
- Monitor with Spring Boot Actuator (add `spring-boot-starter-actuator`).

You've completed the series! Experiment and build more apps.

*Inspired by the [YouTube tutorial](https://youtu.be/gJrjgg1KVL4?si=ojt8B5YjpK-OlvMm) for advanced topics.*
