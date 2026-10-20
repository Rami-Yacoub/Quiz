# AI-Powered Quiz Application

A full-stack web application built with **Angular, Spring Boot, MySQL, and the Google Gemini API** to generate quiz questions using artificial intelligence.

The application combines an interactive frontend, a Java-based backend, and a relational database to deliver a dynamic quiz experience. By integrating Google's Gemini API, the application can generate quiz questions automatically, while MySQL provides persistent data storage.

## ✨ Features

- **AI-Powered Question Generation:** Generate quiz questions dynamically using the Google Gemini API.
- **Interactive User Interface:** Built with Angular and TypeScript.
- **RESTful Backend:** Spring Boot handles business logic and communication between application components.
- **MySQL Database:** Stores application data in a relational database.
- **AI Integration:** Uses Google's generative AI capabilities to automate question creation.
- **Full-Stack Architecture:** Separates frontend, backend, and database responsibilities.
- **Extensible Design:** Provides a foundation for additional quiz features and improvements.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Angular | Frontend framework |
| TypeScript | Frontend application logic |
| HTML5 & CSS3 | User interface structure and styling |
| Java | Backend programming language |
| Spring Boot | Backend framework and application services |
| Spring Web | REST API development |
| Spring Data JPA | Database access, if used in the project |
| MySQL | Relational database and persistent storage |
| Google Gemini API | AI-powered quiz question generation |
| Maven | Backend dependency management, if configured |
| HTTP / REST | Communication between frontend and backend |

## 🏗️ Architecture

The application follows a layered client-server architecture. Angular communicates with the Spring Boot backend through REST endpoints. The backend interacts with MySQL for data persistence and calls the Gemini API to generate quiz questions.

```text
+---------------------------+
|           User            |
+---------------------------+
              |
              v
+---------------------------+
|      Angular Frontend     |
|   TypeScript / HTML / CSS |
+---------------------------+
              |
          HTTP / REST
              |
              v
+---------------------------+
|     Spring Boot Backend   |
|     Java / Business Logic |
+---------------------------+
        |             |
        v             v
+---------------+  +------------------+
| MySQL Database|  | Google Gemini API|
| Data Storage  |  | Question         |
|               |  | Generation       |
+---------------+  +------------------+
```

### Frontend — Angular

The frontend provides the user interface and manages user interactions. It sends requests to the backend and displays the data returned by the REST API.

**Technologies:** Angular, TypeScript, HTML5, CSS3.

### Backend — Spring Boot

The backend manages application logic, exposes REST endpoints, processes frontend requests, communicates with the database, and integrates with the Gemini API.

**Technologies:** Java, Spring Boot, Spring Web.

### Database — MySQL

MySQL is used as the relational database for persistent application data. It provides structured storage and allows the backend to retrieve and manage data as required by the application.

### Artificial Intelligence — Google Gemini API

The Gemini API generates quiz questions dynamically using generative AI. The Spring Boot backend communicates with the external service and returns the generated content to the frontend.

## 📂 Project Structure

```text
Quiz/
├── Frontend/       # Angular application
├── Backend/        # Spring Boot application
└── README.md
```

*Adjust the directory names above if your repository uses a different structure.*

## 🚀 Getting Started

### Prerequisites

Install the following tools before running the application:

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli)
- [Java JDK](https://adoptium.net/)
- [Maven](https://maven.apache.org/) or the Maven Wrapper included in the project
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/Rami-Yacoub/Quiz.git
cd Quiz
```

### 2. Configure the MySQL Database

Start your MySQL server and create the database required by the application.

For example:

```sql
CREATE DATABASE quiz_db;
```

Configure the database connection in the Spring Boot application using the configuration file or environment variables expected by your project.

Example configuration for a Spring Boot application using MySQL and Spring Data JPA:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quiz_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

The database name, credentials, and configuration must match your actual project setup.

### 3. Configure the Gemini API

Obtain an API key from [Google AI Studio](https://aistudio.google.com/apikey).

Configure the key on the backend using the environment variable or configuration property expected by your application.

Example:

```text
GEMINI_API_KEY=your_api_key
```

Keep your API key private and never expose it in frontend code or commit it to GitHub.

### 4. Run the Backend

Navigate to the Spring Boot project directory:

```bash
cd Backend
```

If the project uses the Maven Wrapper, run:

**Windows:**

```bash
mvnw.cmd spring-boot:run
```

**Linux / macOS:**

```bash
./mvnw spring-boot:run
```

Make sure MySQL is running and the database connection is correctly configured before starting the backend.

### 5. Run the Frontend

Open a separate terminal and navigate to the Angular project directory:

```bash
cd Frontend
npm install
ng serve
```

Open the local URL displayed in the terminal, commonly:

`http://localhost:4200`

Ensure the frontend is configured to communicate with the correct backend URL.

## 🔐 Security Best Practices

- Store database credentials in environment variables or secure configuration.
- Keep the Gemini API key on the backend.
- Never commit passwords, API keys, or other sensitive configuration to GitHub.
- Configure appropriate CORS policies for frontend/backend communication.
- Use appropriate database permissions rather than administrative credentials for the application.

## 🔮 Potential Improvements

Possible future enhancements include:

- Custom quiz topics and difficulty levels.
- Multiple-choice answers and automatic scoring.
- Quiz history and performance tracking.
- User authentication and personalized quizzes.
- Improved question validation and generation controls.

These are potential extensions, not a claim that all these features are already implemented.

## 👨‍💻 Author

**Rami Yacoub**

- GitHub: [@Rami-Yacoub](https://github.com/Rami-Yacoub)
- Repository: [Quiz Application](https://github.com/Rami-Yacoub/Quiz)

---

*Built with Angular, Spring Boot, MySQL, and Google Gemini to explore full-stack development and generative AI integration.*
