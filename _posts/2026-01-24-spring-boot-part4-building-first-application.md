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

Time to put it all together! In [Part 1](2026-01-21-spring-boot-part1-introduction-maven-setup.md), we set up Maven. In [Part 2](2026-01-22-spring-boot-part2-annotations-deep-dive.md), we learned annotations. In [Part 3](2026-01-23-spring-boot-part3-dependency-injection-fundamentals.md), we mastered dependency injection. Now we'll build a complete Spring Boot application with a REST API.

## What We'll Build

A simple **Task Management API** that allows users to:
- Create tasks
- List all tasks
- Get a specific task by ID
- Update tasks
- Delete tasks

This will demonstrate the layered architecture we learned.

## Project Setup

Create a new Spring Boot project with this `pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>task-manager</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>task-manager</name>
    <description>Task Management API with Spring Boot</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## Step-by-Step Implementation

### 1. Create the Task Model

```java
// src/main/java/com/example/taskmanager/model/Task.java
public class Task {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDateTime createdAt;
    
    // Default constructor (needed for JSON deserialization)
    public Task() {}
    
    // Constructor for creating new tasks
    public Task(String title, String description) {
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
```

### 2. Create the Repository Layer

```java
// src/main/java/com/example/taskmanager/repository/TaskRepository.java
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public class TaskRepository {
    private final Map<Long, Task> tasks = new HashMap<>();
    private Long nextId = 1L;
    
    public Task save(Task task) {
        if (task.getId() == null) {
            task.setId(nextId++);
        }
        tasks.put(task.getId(), task);
        return task;
    }
    
    public Optional<Task> findById(Long id) {
        return Optional.ofNullable(tasks.get(id));
    }
    
    public List<Task> findAll() {
        return new ArrayList<>(tasks.values());
    }
    
    public void deleteById(Long id) {
        tasks.remove(id);
    }
    
    public boolean existsById(Long id) {
        return tasks.containsKey(id);
    }
}
```

### 3. Create the Service Layer

```java
// src/main/java/com/example/taskmanager/service/TaskService.java
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    
    // Constructor injection
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    public Task createTask(String title, String description) {
        Task task = new Task(title, description);
        return taskRepository.save(task);
    }
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public Task updateTask(Long id, String title, String description, Boolean completed) {
        Optional<Task> existingTask = taskRepository.findById(id);
        if (existingTask.isPresent()) {
            Task task = existingTask.get();
            if (title != null) task.setTitle(title);
            if (description != null) task.setDescription(description);
            if (completed != null) task.setCompleted(completed);
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task not found with id: " + id);
    }
    
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }
}
```

### 4. Create the Controller Layer

```java
// src/main/java/com/example/taskmanager/controller/TaskController.java
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    
    // Constructor injection
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    @PostMapping
    public Task createTask(@RequestBody CreateTaskRequest request) {
        return taskService.createTask(request.getTitle(), request.getDescription());
    }
    
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    
    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }
    
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody UpdateTaskRequest request) {
        return taskService.updateTask(id, request.getTitle(), request.getDescription(), request.getCompleted());
    }
    
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}

// Request DTOs
class CreateTaskRequest {
    private String title;
    private String description;
    
    // getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

class UpdateTaskRequest {
    private String title;
    private String description;
    private Boolean completed;
    
    // getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}
```

### 5. Create the Main Application Class

```java
// src/main/java/com/example/taskmanager/TaskManagerApplication.java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}
```

## Testing Your Application

1. **Build and run**:
   ```bash
   mvn clean compile
   mvn spring-boot:run
   ```

2. **Test the API** using curl or a tool like Postman:

   **Create a task**:
   ```bash
   curl -X POST http://localhost:8080/api/tasks \
        -H "Content-Type: application/json" \
        -d '{"title": "Learn Spring Boot", "description": "Complete the tutorial series"}'
   ```

   **Get all tasks**:
   ```bash
   curl http://localhost:8080/api/tasks
   ```

   **Get a specific task**:
   ```bash
   curl http://localhost:8080/api/tasks/1
   ```

   **Update a task**:
   ```bash
   curl -X PUT http://localhost:8080/api/tasks/1 \
        -H "Content-Type: application/json" \
        -d '{"completed": true}'
   ```

   **Delete a task**:
   ```bash
   curl -X DELETE http://localhost:8080/api/tasks/1
   ```

## Understanding the Flow

When a request comes in:

1. **Controller** receives the HTTP request
2. **Controller** calls the appropriate **Service** method
3. **Service** contains business logic and calls **Repository**
4. **Repository** handles data storage/retrieval
5. Data flows back up the layers to the **Controller**
6. **Controller** returns the response as JSON

This separation makes your code:
- **Testable**: Each layer can be tested independently
- **Maintainable**: Changes in one layer don't affect others
- **Scalable**: You can modify layers without breaking the whole app

## Common Issues and Solutions

**Issue**: Getting 404 errors
**Solution**: Make sure your controller class is in the same package or sub-package as your main application class.

**Issue**: JSON parsing errors
**Solution**: Ensure your request body matches the DTO structure exactly.

**Issue**: Null pointer exceptions
**Solution**: Check that all required dependencies are properly injected via constructor.

## What's Next?

In [Part 5](2026-01-25-spring-boot-part5-advanced-features-best-practices.md), we'll add testing, configuration management, and deployment strategies to make your application production-ready.

**Congratulations!** You've built a complete REST API with Spring Boot. Try extending it by adding validation, error handling, or connecting to a real database!
