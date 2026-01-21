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

Welcome to the final part! By now, you know how to create a basic Spring Boot app. In this part, we'll add professional features to make your app production-ready.

**What we'll cover:**
- Testing to ensure code quality
- Configuration management for different environments  
- Monitoring tools to keep your app healthy
- Deployment options to share your app
- Best practices for maintainable code

Let's make your Spring Boot app enterprise-ready!

## Testing Your Application

Testing ensures your code works correctly and helps catch bugs early. Spring Boot integrates easily with testing tools.

### Why Test?

- **Catch bugs early**: Tests find issues before users do.
- **Refactor safely**: Change code without breaking features.
- **Document behavior**: Tests show what your code should do.

### Unit Testing with JUnit 5

Spring Boot includes testing tools automatically. In your `pom.xml`, you should see:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

This includes JUnit 5, Mockito, and other testing libraries.

#### Simple Test Example

Let's test our `TaskService`. First, create a test class in `src/test/java`:

```java
@SpringBootTest  // Loads the full Spring context
class TaskServiceTest {
    
    @Autowired  // Inject the real service
    private TaskService taskService;
    
    @MockBean  // Replace with a fake version
    private TaskRepository taskRepository;
    
    @Test
    void createTask_shouldReturnSavedTask() {
        // Arrange: Set up test data
        Task mockTask = new Task("Learn Spring", "Study Spring Boot");
        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);
        
        // Act: Call the method
        Task result = taskService.createTask("Learn Spring", "Study Spring Boot");
        
        // Assert: Check the result
        assertNotNull(result);  // Should not be null
        assertEquals("Learn Spring", result.getTitle());  // Title matches
        verify(taskRepository).save(any(Task.class));  // Repository was called
    }
}
```

**How it works:**
1. `@SpringBootTest` starts Spring Boot for testing.
2. `@MockBean` creates a fake `TaskRepository` so we don't need a real database.
3. `when(...).thenReturn(...)` tells the fake what to return.
4. `assertEquals` checks if the result is what we expect.
5. `verify` ensures the repository's save method was called.

Run tests with: `mvn test`

#### Integration Test Example

Test the full API without mocking:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TaskControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void getAllTasks_shouldReturnTasks() {
        // This would test the actual API endpoint
        ResponseEntity<Task[]> response = restTemplate.getForEntity("/tasks", Task[].class);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
```

This tests the real controller, service, and repository together.

## Configuration Management

Instead of hardcoding values in code, store them in configuration files. This lets you change settings without rebuilding the app.

### Basic Properties File

Create `src/main/resources/application.properties`:

```properties
# Server settings
server.port=8081
server.servlet.context-path=/api

# App information
app.name=My Task App
app.version=1.0.0
app.admin.email=admin@myapp.com

# Database settings
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=
```

### Using Properties in Code

#### Method 1: @Value Annotation

Inject single values directly:

```java
@Service
public class EmailService {
    
    @Value("${app.admin.email}")
    private String adminEmail;
    
    @Value("${app.name}")
    private String appName;
    
    public void sendWelcomeEmail(String userEmail) {
        String subject = "Welcome to " + appName;
        String body = "Contact admin at: " + adminEmail;
        // Send email logic here
    }
}
```

**When to use @Value:**
- Single properties
- Simple values

#### Method 2: @ConfigurationProperties (Better for Groups)

For related settings, create a config class:

```java
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    
    private String name;
    private String version;
    private Admin admin;
    
    // Constructor, getters, setters
    
    public static class Admin {
        private String email;
        private String phone;
        
        // getters and setters
    }
    
    // Methods to use the config
    public String getFullAppInfo() {
        return name + " v" + version;
    }
}
```

In your service:

```java
@Service
public class AppService {
    
    private final AppConfig config;
    
    public AppService(AppConfig config) {
        this.config = config;
    }
    
    public void printInfo() {
        System.out.println("App: " + config.getFullAppInfo());
        System.out.println("Admin: " + config.getAdmin().getEmail());
    }
}
```

**Why @ConfigurationProperties is better:**
- Type safety (no String conversion needed)
- Validation support
- IDE autocomplete
- Groups related settings

### Environment-Specific Configuration

Use profiles for different environments:

`application-dev.properties`:
```properties
server.port=8080
app.database.url=jdbc:h2:mem:devdb
logging.level.com.example=DEBUG
```

`application-prod.properties`:
```properties
server.port=8080
app.database.url=jdbc:postgresql://prod-db:5432/myapp
logging.level.com.example=INFO
```

Activate a profile in `application.properties`:
```properties
spring.profiles.active=dev
```

Or when running:
```bash
java -jar app.jar --spring.profiles.active=prod
```

**Example:** In dev, use H2 database (in-memory). In prod, use PostgreSQL.

## Monitoring with Spring Boot Actuator

Actuator provides built-in tools to monitor your app's health, performance, and more. It's like a dashboard for your application.

### Adding Actuator

Add to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Enabling Endpoints

In `application.properties`, expose the endpoints:

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### Useful Endpoints

- **Health Check**: `http://localhost:8080/actuator/health`
  - Shows if app is "UP" or "DOWN"
  - Includes database, disk space status

- **Application Info**: `http://localhost:8080/actuator/info`
  - Custom info you can add

- **Metrics**: `http://localhost:8080/actuator/metrics`
  - JVM memory, HTTP requests, etc.

**Example:** Visit `/actuator/health` in your browser. If everything is working, you'll see:

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 500068036608,
        "free": 200000000000,
        "threshold": 10485760
      }
    }
  }
}
```

This helps you know if your app and its dependencies are healthy.

## Deployment Strategies

Once your app is ready, deploy it so others can use it.

### 1. Building a JAR File

Spring Boot packages everything into a single JAR file.

Run this command:
```bash
mvn clean package
```

This creates `target/your-app-0.0.1-SNAPSHOT.jar`.

**What happens:**
- Compiles your code
- Runs tests
- Packages classes, dependencies, and resources into one JAR

### 2. Running the JAR

To run locally or on a server:
```bash
java -jar target/your-app-0.0.1-SNAPSHOT.jar
```

Your app starts on the configured port (default 8080).

### 3. Containerization with Docker

Docker packages your app with its environment.

Create a `Dockerfile` in your project root:

```dockerfile
# Use Java 17
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Expose port 8080
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

**Step-by-step:**
1. **Build the JAR**: `mvn clean package`
2. **Build Docker image**: `docker build -t my-task-app .`
3. **Run container**: `docker run -p 8080:8080 my-task-app`

**What this does:**
- Uses a lightweight Java image
- Copies your JAR into the container
- Exposes port 8080
- Runs your Spring Boot app

**Example:** After running, visit `http://localhost:8080` to use your API.

## Best Practices Recap

Follow these guidelines for better Spring Boot apps:

1. **Layered Architecture**
   - **Controller**: Handles HTTP requests/responses
   - **Service**: Business logic
   - **Repository**: Data access
   
   Example:
   ```java
   @RestController
   public class TaskController {
       private final TaskService service;
       
       public TaskController(TaskService service) {
           this.service = service;
       }
   }
   ```

2. **Constructor Injection**
   ```java
   @Service
   public class TaskService {
       private final TaskRepository repo;
       
       public TaskService(TaskRepository repo) {  // Preferred
           this.repo = repo;
       }
   }
   ```
   Why? Easier to test, immutable dependencies.

3. **External Configuration**
   - Use `application.properties` for settings
   - Profiles for different environments

4. **Write Tests**
   - Unit tests for logic
   - Integration tests for full flow

5. **Proper HTTP Status Codes**
   ```java
   @PostMapping
   public ResponseEntity<Task> createTask(@RequestBody Task task) {
       Task saved = service.create(task);
       return ResponseEntity.status(HttpStatus.CREATED).body(saved);
   }
   ```

6. **Monitor with Actuator**
   - Health checks
   - Metrics
   - Custom endpoints

7. **Security Basics**
   - Validate input
   - Use HTTPS in production
   - Handle errors gracefully

8. **Logging**
   ```java
   @Service
   public class TaskService {
       private static final Logger log = LoggerFactory.getLogger(TaskService.class);
       
       public Task createTask(String title, String desc) {
           log.info("Creating task: {}", title);
           // ... logic
       }
   }
   ```

9. **Version Your API**
   ```java
   @RestController
   @RequestMapping("/api/v1/tasks")
   public class TaskController { ... }
   ```

10. **Handle Exceptions**
    ```java
    @RestControllerAdvice
    public class GlobalExceptionHandler {
        @ExceptionHandler(TaskNotFoundException.class)
        public ResponseEntity<String> handleNotFound(TaskNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
    ```

## Series Conclusion

Congratulations! You've learned the fundamentals of Spring Boot:
- **Maven process** for building and dependency management
- **Core annotations** for wiring your application
- **Dependency Injection** (especially constructor injection)
- **REST API development** with Spring MVC
- **Production-ready features** like testing, configuration, and monitoring

## What's Next?

To continue your journey:
- Learn about **Spring Data JPA** for real database integration
- Explore **Spring Security** for authentication and authorization
- Master **Microservices architecture** with Spring Cloud
- Build a frontend using React, Angular, or Thymeleaf

**Keep coding and building!** Spring Boot is a vast ecosystem, and you now have the solid foundation to explore it further.

---

*This concludes our Spring Boot Development Series. Thank you for following along!*

[Part 1: Maven Setup ←]({% post_url 2026-01-21-spring-boot-part1-introduction-maven-setup %}) | [Part 4: Building an API ←]({% post_url 2026-01-24-spring-boot-part4-building-first-application %}) | [Home](/archive)
