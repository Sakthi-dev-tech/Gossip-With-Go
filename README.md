# Gossip With Go

## Submitter Information
*   **Name:** Meenakshi Sundaram Sakthieesvar
*   **Matriculation Number:** A0322186H
## Links
*   **Source Code Repository:** [https://github.com/Sakthi-dev-tech/Gossip-With-Go](Github Link)
*   **Deployed Application:** [https://sakthi-dev-tech.github.io/Gossip-With-Go/](Deployed Website)

---

## Setup Instructions

### Prerequisites
*   **Go** (v1.23 or later)
*   **Node.js** (v16 or later) and **npm**
*   **PostgreSQL** (or Docker to run it)

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a `.env` file in the `backend` directory with the following variables:
    ```env
    GOOSE_DBSTRING="host=localhost user=postgres password=<your_password> dbname=<your_database_name>"
    GOOSE_DRIVER=postgres
    GOOSE_MIGRATION_DIR=./internal/adapters/postgresql/migrations
    JWT_ENCRYPTION_KEY=<generated_encryption_key_here>
    JWT_DURATION=<jwt_key_duration_here(for e.g. 24h)>
    ```

3.  Install dependencies:
    ```bash
    go mod download
    ```
4.  Run the application:
    ```bash
    go run ./cmd
    ```
    The server will start on `http://localhost:8080`.

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd gossip-with-go
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

---

## AI Usage Documentation
**(Placeholder: Please update this section with your specific details)**

*   **Code Generation:** 
    * Used Gemini 3 Pro for frontend design and helping out with implementation as I am comfortable with React
    * Used Claude Sonnet 4.5 for helping out with repetitive work that takes time

*   **Research:**
    * Used Claude Sonnet 4.5 to teach me how to deploy the frontend on GitHub Pages
    * Used Claude Sonnet 4.5 to help me research on how to make my backend more efficient to save costs
    * Used Gemini 3 Pro to help me understand how to go about structuring the Go backend

*   **Documentation:** 
    * Used Gemini 3 Pro to generate this README

---

## User Manual

### 1. Registration & Login
*   **Register:** New users can sign up by providing a unique username, email, and password.
*   **Login:** Existing users can log in to receive a secure access token (JWT) which is stored for session management.

### 2. Topics
*   **View Topics:** Browse a list of discussion topics.
*   **Create Topic:** Authenticated users can create new topics to start discussions.
*   **Manage:** Users can update or delete topics they have created.

### 3. Posts
*   **View Posts:** Click on a topic to view related posts.
*   **Create Post:** Share your thoughts by creating a post under a specific topic.
*   **Manage:** Edit or remove your posts as needed.

### 4. Comments
*   **Interact:** engage with other users by commenting on their posts.
*   **Reply:** Create threads of conversation through comments.

---

## Appendix: Features List

### Core Features
*   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and BCrypt for password hashing.
*   **Topic Management:** CRUD (Create, Read, Update, Delete) operations for discussion topics.
*   **Post Management:** Full CRUD capabilities for posts linked to specific topics.
*   **Comment System:** Interactive commenting system for posts.
*   **Profile Management:** Ability to fetch user details by username.

### Technical Features
*   **Backend:** Built with Go (Golang) using `chi` router for high performance.
*   **Database:** PostgreSQL with `pgx` driver and `sqlc` for type-safe SQL queries. Connection pooling implemented for efficiency.
*   **Frontend:** React.js single-page application (SPA) with Material UI for a responsive and modern design.
*   **Security:**
    *   HttpOnly Cookies for secure token storage.
    *   CORS configuration for security.
    *   Middleware for logging, request recovery, and timeouts.
*   **Deployment:** Dockerized database setup for easy development (docker-compose included).