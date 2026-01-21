---
layout: post
title: "🛠️ Spring Boot Development Series - Part 4: Building Your First Application"
categories: [Spring Boot, Java, Tutorial]
description: "Combine concepts from Parts 1-3 to build a practical REST API application."
excerpt: "Step-by-step guide to creating a Spring Boot app with controllers, services, and repositories."
series: "Spring Boot Development Series"
part: 4
---

# Spring Boot Development Series - Part 4: Building Your First Application

Now that we've covered setup ([Part 1](2026-01-21-spring-boot-part1-introduction-maven-setup.md)), annotations ([Part 2](2026-01-22-spring-boot-part2-annotations-deep-dive.md)), and DI ([Part 3](2026-01-23-spring-boot-part3-dependency-injection-fundamentals.md)), let's build a complete app: a simple REST API for managing users.

## Project Structure
Using Maven from Part 1, create:
- `src/main/java/com/example/demo/DemoApplication.java`
- `src/main/java/com/example/demo/controller/UserController.java`
- `src/main/java/com/example/demo/service/UserService.java`
- `src/main/java/com/example/demo/repository/UserRepository.java`
- `src/main/java/com/example/demo/model/User.java`

## Step-by-Step Implementation

### 1. Model Class
```java
public class User {
    private Long id;
    private String name;
    private String email;

    // Constructors, getters, setters
}
```

### 2. Repository (Data Access)
```java
@Repository
public class UserRepository {
    private final Map<Long, User> users = new HashMap<>();
    private Long idCounter = 1L;

    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }

    public User save(User user) {
        user.setId(idCounter++);
        users.put(user.getId(), user);
        return user;
    }
}
```

### 3. Service (Business Logic)
```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public User createUser(User user) {
        return repository.save(user);
    }
}
```

### 4. Controller (API Endpoints)
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.createUser(user);
    }
}
```

### 5. Main Application
```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## Running and Testing
1. Run `mvn spring-boot:run`.
2. Test with curl: `curl -X GET http://localhost:8080/api/users` or `curl -X POST -H "Content-Type: application/json" -d '{"name":"John","email":"john@example.com"}' http://localhost:8080/api/users`.

The YouTube video demonstrates a similar app build from 30:00-45:00.

In [Part 5](2026-01-25-spring-boot-part5-advanced-features-best-practices.md), we'll add testing and deployment.

*Full code available in the [YouTube tutorial](https://youtu.be/gJrjgg1KVL4?si=ojt8B5YjpK-OlvMm).*
