---
layout: post
title: "🔗 Spring Boot Development Series - Part 3: Dependency Injection Fundamentals"
categories: [Spring Boot, Java, Tutorial]
description: "Understand dependency injection (DI) in Spring Boot, with a focus on constructor injection."
excerpt: "Learn what DI is, its types, and why constructor injection is preferred for maintainable code."
series: "Spring Boot Development Series"
part: 3
---

# Spring Boot Development Series - Part 3: Dependency Injection Fundamentals

Continuing from [Part 2](2026-01-22-spring-boot-part2-annotations-deep-dive.md), where we explored annotations, this post demystifies dependency injection (DI)—Spring's core feature for loose coupling. We'll focus on constructor injection, as recommended by Spring.

## What is Dependency Injection?

DI is a design pattern where Spring provides dependencies to a class instead of the class creating them. This promotes:
- **Testability**: Easy to mock dependencies.
- **Maintainability**: Changes don't ripple through code.
- **Flexibility**: Swap implementations without altering classes.

Without DI, you'd manually instantiate objects, leading to tight coupling.

The YouTube video explains DI basics from 20:00-30:00.

## Types of Dependency Injection

1. **Constructor Injection**: Dependencies passed via constructor. Preferred for immutability and required deps.
2. **Setter Injection**: Via setter methods. For optional deps.
3. **Field Injection**: Direct field annotation (e.g., `@Autowired`). Avoid for testability issues.

## Constructor Injection in Action

Using annotations from Part 2, here's an example:

```java
@Service
public class GreetingService {
    private final MessageRepository repository;

    // Constructor injection
    public GreetingService(MessageRepository repository) {
        this.repository = repository;
    }

    public String getGreeting() {
        return repository.findMessage();
    }
}

@Repository
public class MessageRepository {
    public String findMessage() {
        return "Hello from DB!";
    }
}
```

- No `@Autowired` needed on constructor (Spring 4.3+ infers it).
- Dependencies are final, ensuring immutability.
- Easy to test: Pass mocks in tests.

### Why Constructor Over Others?
- Forces required dependencies.
- Prevents circular deps.
- Clear at instantiation.

## Practical Example with Controller

```java
@RestController
@RequestMapping("/api")
public class GreetingController {
    private final GreetingService service;

    public GreetingController(GreetingService service) {
        this.service = service;
    }

    @GetMapping("/greet")
    public String greet() {
        return service.getGreeting();
    }
}
```

In [Part 4](2026-01-24-spring-boot-part4-building-first-application.md), we'll build a full app using these concepts.

*Check the [YouTube tutorial](https://youtu.be/gJrjgg1KVL4?si=ojt8B5YjpK-OlvMm) for DI examples.*
