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

Welcome back! In [Part 1](2026-01-21-spring-boot-part1-introduction-maven-setup.md), we set up Maven and learned Spring Boot basics. In [Part 2](2026-01-22-spring-boot-part2-annotations-deep-dive.md), we explored annotations. Now we'll learn about **dependency injection** - how Spring Boot automatically connects your classes together.

## What is Dependency Injection?

Dependency injection (DI) is a design pattern where Spring Boot automatically provides the objects (dependencies) that your classes need, instead of your classes creating them manually.

**Without DI (Bad Example)**:
```java
public class UserController {
    private UserService userService = new UserService(); // Manual creation
}
```

**With DI (Good Example)**:
```java
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService; // Spring provides this
    }
}
```

**Why DI matters**:
- **Testability**: Easy to replace real objects with test versions
- **Flexibility**: Change implementations without changing code
- **Maintainability**: Clear dependencies and loose coupling

## Types of Dependency Injection

Spring Boot supports three ways to inject dependencies:

### 1. Constructor Injection (Recommended)

Dependencies are provided through the constructor:

```java
@Service
public class OrderService {
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    
    // Constructor injection
    public OrderService(UserRepository userRepository, PaymentService paymentService) {
        this.userRepository = userRepository;
        this.paymentService = paymentService;
    }
    
    public Order createOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId());
        Payment payment = paymentService.processPayment(request.getAmount());
        return new Order(user, payment);
    }
}
```

**Advantages**:
- Dependencies are final (immutable)
- Required dependencies are guaranteed
- Easy to test (just pass different implementations)
- Clear what the class needs to work

### 2. Setter Injection

Dependencies are provided through setter methods:

```java
@Service
public class EmailService {
    private EmailProvider emailProvider;
    
    // Setter injection
    @Autowired
    public void setEmailProvider(EmailProvider emailProvider) {
        this.emailProvider = emailProvider;
    }
    
    public void sendWelcomeEmail(User user) {
        emailProvider.sendEmail(user.getEmail(), "Welcome!", "Welcome message...");
    }
}
```

**Use when**: Dependencies are optional or may change at runtime.

### 3. Field Injection

Dependencies are injected directly into fields:

```java
@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private PdfGenerator pdfGenerator;
    
    public byte[] generateReport(Long userId) {
        List<ReportData> data = reportRepository.findByUserId(userId);
        return pdfGenerator.generatePdf(data);
    }
}
```

**Avoid this approach** because:
- Harder to test (can't easily replace dependencies)
- Dependencies aren't final
- Hides what the class actually needs

## Constructor Injection in Action

Let's build a complete example using constructor injection:

```java
// Data Access Layer
@Repository
public class UserRepository {
    private final Map<Long, User> users = new HashMap<>();
    
    public User save(User user) {
        // Save logic
        return user;
    }
    
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(users.get(id));
    }
}

// Business Logic Layer
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // Constructor injection - all dependencies provided by Spring
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public User registerUser(String name, String email) {
        User user = new User(name, email);
        User savedUser = userRepository.save(user);
        emailService.sendWelcomeEmail(savedUser);
        return savedUser;
    }
    
    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }
}

// Email Service
@Service
public class EmailService {
    public void sendWelcomeEmail(User user) {
        System.out.println("Sending welcome email to: " + user.getEmail());
    }
}

// Web Layer
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    // Constructor injection
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return userService.registerUser(request.getName(), request.getEmail());
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

// Request DTO
public class RegisterRequest {
    private String name;
    private String email;
    // getters and setters
}

// Main Application
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

## How Spring Boot Makes This Work

When you run your Spring Boot application:

1. **Component Scanning**: Spring finds all classes with `@Service`, `@Repository`, `@RestController`, etc.
2. **Bean Creation**: Spring creates instances of these classes
3. **Dependency Resolution**: Spring looks at constructor parameters and finds matching beans
4. **Injection**: Spring calls constructors with the appropriate dependencies
5. **Ready to Use**: Your application is fully wired and ready to handle requests

## Testing with Dependency Injection

Constructor injection makes testing much easier:

```java
@SpringBootTest
public class UserServiceTest {
    
    @Test
    public void registerUser_shouldSaveAndSendEmail() {
        // Create test doubles (mocks)
        UserRepository mockRepository = mock(UserRepository.class);
        EmailService mockEmailService = mock(EmailService.class);
        
        // Create service with mock dependencies
        UserService userService = new UserService(mockRepository, mockEmailService);
        
        // Setup expectations
        User expectedUser = new User("John", "john@example.com");
        when(mockRepository.save(any(User.class))).thenReturn(expectedUser);
        
        // Test the method
        User result = userService.registerUser("John", "john@example.com");
        
        // Verify interactions
        assertThat(result.getName()).isEqualTo("John");
        verify(mockRepository).save(any(User.class));
        verify(mockEmailService).sendWelcomeEmail(expectedUser);
    }
}
```

## Common Questions

**Q: Why use `final` for injected dependencies?**
A: It ensures immutability and prevents accidental reassignment.

**Q: What if Spring can't find a matching bean?**
A: You'll get a clear error message at startup telling you which dependency is missing.

**Q: Can I mix injection types in one class?**
A: Yes, but constructor injection is preferred for required dependencies, setter for optional ones.

## Best Practices

1. **Use constructor injection** for required dependencies
2. **Make injected fields `final`** when possible
3. **Avoid field injection** in production code
4. **Use descriptive parameter names** in constructors
5. **Test with mock dependencies** to isolate units

## What's Next?

In [Part 4](2026-01-24-spring-boot-part4-building-first-application.md), we'll put everything together and build a complete Spring Boot application with a REST API, database integration, and proper error handling.

**Try it yourself**: Refactor one of your classes to use constructor injection instead of field injection. Notice how much cleaner and more testable the code becomes!
