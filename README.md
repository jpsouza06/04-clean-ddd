<p align="center">
    Made by <a href="https://github.com/jpsouza06">Joao Paulo</a>
</p>


 ## 

# 📌 Contents

* [About](#rocket-about)
* [Architecture & Design Principles](#-architecture--design-principles)
* [Main Concepts Implemented](#-main-concepts-implemented)
* [Technologies](#rocket-technologies) 


# :rocket: About

This is a forum application built with DDD and Clean Architecture.

It allows users to:

- Ask questions

- Answer questions posted by other users

- List, search, and interact with posts

- The asker can choose the best answer for each question and the answerer receives a notification

## 🧠 Architecture & Design Principles:

This project follows the principles of Domain-Driven Design (DDD) and Clean Architecture to promote a clear separation of concerns and to make the system scalable, testable, and maintainable.

The architecture was designed to separate concerns and increase maintainability, scalability, and testability of the system.

## 🧩 Main Concepts Implemented
### ✅ Entities:

Entities represent the core business objects with a unique identity over time.
In this system, examples include:

Student: represents a forum user.

Instructor: represents a forum user.

Question: represents a question posted by a user.

Answer: represents an answer to a question.

These entities encapsulate their own behavior and validations.

### 🔗 Aggregate Roots:

Each aggregate ensures consistency boundaries. Only the root can be accessed directly by the application layer.

Question is the aggregate root for answers and comments on a question.

Answer is its own aggregate if it includes votes or threaded comments.

This design helps prevent inconsistencies across complex operations.

### 🧭 Domains and Subdomains:
The system is divided into well-defined subdomains:

- Forum (Core Domain): questions, answers, user.

- Notification: domain events that trigger notifications for new answers or replies.

Each subdomain has its own bounded context, separating responsibilities and models clearly.

### 📢 Domain Events:
Events are used to decouple side effects from core logic.
Examples:

- AnswerCreatedEvent: triggered when an answer is posted.

- BestAnswerChosenEvent: triggered when a question author marks an answer as accepted.

These events can be handled asynchronously to trigger actions like notifications, emails, or analytics.

### 🚫 Error Handling:
The application follows a functional error handling pattern:

Use of Either, Result, or custom error classes instead of throwing exceptions.

Ensures all errors are explicit and predictable.

Example:

```
const result = await useCase.execute(input);

if (result.isLeft()) {
    return failure(result.value);
}
```
This approach increases reliability and simplifies testing.

### 🧱 Use Cases / Application Layer:
All business logic is encapsulated in use cases, such as:

- CreateQuestionUseCase

- AnswerQuestionUseCase

- ChooseBestAnswerUseCase

These are orchestrators that interact with entities, repositories, and services. They do not contain infrastructure or framework-specific code.

### 🗂️ Repository Pattern
Repositories abstract data access, allowing the domain to remain persistence-agnostic.

Example:

```
interface QuestionRepository {
  findById(id: string): Promise<Question | null>;
  save(question: Question): Promise<void>;
}
```
This layered architecture results in a robust, decoupled codebase where:

Domain is independent of frameworks

Application coordinates tasks

Infrastructure provides concrete implementations

Interface handles input/output like HTTP, GraphQL, CLI, etc.

##

# :computer: Technologies
This project was made using the follow technologies:

* [Typescript](https://www.typescriptlang.org/)          
