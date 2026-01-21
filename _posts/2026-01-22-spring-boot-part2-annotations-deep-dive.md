---
layout: post
title: "📝 Spring Boot Development Series - Part 2: Annotations Deep Dive"
categories: [Spring Boot, Java, Tutorial]
description: "Master essential Spring Boot annotations for configuration, controllers, and services."
excerpt: "Dive into key annotations like @SpringBootApplication and @RestController, with examples and best practices."
series: "Spring Boot Development Series"
part: 2
---

# Spring Boot Development Series - Part 2: Annotations Deep Dive

Building on [Part 1](2026-01-21-spring-boot-part1-introduction-maven-setup.md), where we set up Maven and introduced Spring Boot, this post explores annotations—the magic that wires your application. Annotations reduce boilerplate and enable features like auto-configuration.

## Why Annotations Matter in Spring Boot

Annotations are metadata that tell Spring how to handle classes, methods, and fields. They enable dependency injection, request mapping, and more. Spring Boot leverages them heavily for convention-over-configuration.

The YouTube video delves into annotations from 10:00-20:00, showing how they simplify code.

## Core Annotations

### @SpringBootApplication
This is the entry point for your app. It combines:
- `@Configuration`: Marks the class as a source of bean definitions.
- `@EnableAutoConfiguration`: Enables Spring Boot's auto-config.
- `@ComponentScan`: Scans for components in the package.

Example:
```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

Place this in `src/main/java/com/example/DemoApplication.java`.

### @RestController and @RequestMapping
For web apps, `@RestController` combines `@Controller` and `@ResponseBody`. `@RequestMapping` maps HTTP requests.

Example:
```java
@RestController
@RequestMapping("/api")
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```

- `@GetMapping` is a shortcut for `@RequestMapping(method = RequestMethod.GET)`.
- Other mappings: `@PostMapping`, `@PutMapping`, etc.

### @Service, @Repository, and @Component
These mark classes as Spring-managed beans:
- `@Service`: For business logic.
- `@Repository`: For data access (adds exception translation).
- `@Component`: Generic stereotype.

Example:
```java
@Service
public class GreetingService {
    public String getGreeting() {
        return "Welcome!";
    }
}
```

### @Autowired
Injects dependencies. We'll cover injection deeply in [Part 3](2026-01-23-spring-boot-part3-dependency-injection-fundamentals.md).

```java
@RestController
public class HelloController {
    @Autowired
    private GreetingService greetingService;
}
```

## Best Practices
- Use annotations sparingly; prefer constructor injection (covered next).
- Group related annotations for readability.
- Test annotations with integration tests.

Experiment with these in a Maven project from Part 1. In [Part 3](2026-01-23-spring-boot-part3-dependency-injection-fundamentals.md), we'll focus on dependency injection patterns.

*Refer to the [YouTube tutorial](https://youtu.be/gJrjgg1KVL4?si=ojt8B5YjpK-OlvMm) for annotation demos.*
