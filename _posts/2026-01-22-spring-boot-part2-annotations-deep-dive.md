---
layout: post
title: "📝 Spring Boot Development Series - Part 2: Annotations Deep Dive"
categories: [Spring Boot, Java, Tutorial]
description: "Master essential Spring Boot annotations for configuration, controllers, and services."
excerpt: "Dive into key annotations like @SpringBootApplication and @RestController, with examples and best practices."
series: "Spring Boot Development Series"
part: 2
---

## Why Annotations Matter in Spring Boot

Annotations are like labels or notes you put on your code to give Spring Boot instructions. They tell Spring how to handle classes, methods, and fields without writing lots of configuration code.

**Simple Analogy**: Think of annotations as sticky notes on your code that say "Hey Spring, handle this part for me!"

## Core Annotations

### @SpringBootApplication - Your App's Starting Point

This is the most important annotation - it marks where your Spring Boot application begins. It combines three powerful annotations:

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

**What it does**:
- Tells Spring Boot this is your main application class
- Automatically finds and configures your components
- Sets up sensible defaults for your app

**Where to put it**: Always in your main package (like `com.example.myapp`)

### @RestController - For Web APIs

This annotation creates web endpoints that return data (usually JSON):

```java
@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Spring Boot!";
    }
    
    @GetMapping("/user/{id}")
    public User getUser(@PathVariable Long id) {
        // Get user by ID and return as JSON
        return userService.findById(id);
    }
}
```

**What it does**:
- Marks the class as a web controller
- Automatically converts your return values to JSON
- Handles HTTP requests and responses

### @Service - For Business Logic

Use this for classes that contain your app's main logic:

```java
@Service
public class UserService {
    
    public User createUser(String name, String email) {
        User user = new User(name, email);
        // Save to database
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
```

**What it does**:
- Marks the class as a service component
- Makes it available for dependency injection
- Groups related business logic together

### @Repository - For Database Access

This annotation is for classes that talk to your database:

```java
@Repository
public class UserRepository {
    
    public User save(User user) {
        // Save to database
        return user;
    }
    
    public User findById(Long id) {
        // Find user in database
        return null; // placeholder
    }
    
    public List<User> findAll() {
        // Get all users from database
        return new ArrayList<>();
    }
}
```

**What it does**:
- Marks the class as a data access component
- Provides automatic exception translation
- Makes database errors easier to handle

### @Autowired - Connecting Components

This annotation tells Spring to automatically provide dependencies:

```java
@RestController
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
```

**What it does**:
- Automatically finds and injects the UserService
- Connects your components together
- No need to manually create objects

## Common HTTP Annotations

### Request Mapping Annotations

```java
@RestController
@RequestMapping("/api/users")  // Base path for all methods
public class UserController {
    
    @GetMapping           // GET /api/users
    public List<User> getAllUsers() { /* */ }
    
    @GetMapping("/{id}")  // GET /api/users/123
    public User getUser(@PathVariable Long id) { /* */ }
    
    @PostMapping          // POST /api/users
    public User createUser(@RequestBody User user) { /* */ }
    
    @PutMapping("/{id}")  // PUT /api/users/123
    public User updateUser(@PathVariable Long id, @RequestBody User user) { /* */ }
    
    @DeleteMapping("/{id}") // DELETE /api/users/123
    public void deleteUser(@PathVariable Long id) { /* */ }
}
```

**What they do**:
- `@GetMapping`: Handle GET requests (read data)
- `@PostMapping`: Handle POST requests (create data)
- `@PutMapping`: Handle PUT requests (update data)
- `@DeleteMapping`: Handle DELETE requests (remove data)

## Practical Example: Complete User Management API

Let's put it all together:

```java
// Main Application
@SpringBootApplication
public class UserManagementApp {
    public static void main(String[] args) {
        SpringApplication.run(UserManagementApp.class, args);
    }
}

// Data Model
public class User {
    private Long id;
    private String name;
    private String email;
    
    // constructors, getters, setters
}

// Data Access
@Repository
public class UserRepository {
    private List<User> users = new ArrayList<>();
    private Long nextId = 1L;
    
    public User save(User user) {
        user.setId(nextId++);
        users.add(user);
        return user;
    }
    
    public List<User> findAll() {
        return users;
    }
    
    public Optional<User> findById(Long id) {
        return users.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst();
    }
}

// Business Logic
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(String name, String email) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}

// Web API
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public User createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request.getName(), request.getEmail());
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

// Request DTO
public class CreateUserRequest {
    private String name;
    private String email;
    
    // getters and setters
}
```

## Key Takeaways

1. **@SpringBootApplication** starts your app
2. **@RestController** creates web APIs
3. **@Service** contains business logic
4. **@Repository** handles data access
5. **@Autowired** connects everything together
6. **HTTP annotations** (@GetMapping, @PostMapping, etc.) handle web requests

## What's Next?

In [Part 3](2026-01-23-spring-boot-part3-dependency-injection-fundamentals.md), we'll dive deeper into dependency injection and why constructor injection is preferred. You'll learn how Spring Boot automatically manages object creation and wiring.

**Try it yourself**: Create a simple REST API using the annotations above, then run it with `mvn spring-boot:run`!
