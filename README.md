# Bookstore Backend API

A comprehensive RESTful API backend for a bookstore management system built with Spring Boot 4.0.1.

## Features

- **User Management**: Registration, authentication, and user profile management
- **Book Management**: CRUD operations for books with search and filtering
- **Author Management**: Manage authors and their information
- **Category Management**: Organize books by categories
- **Order Management**: Create and manage orders with inventory tracking
- **JWT Authentication**: Secure API endpoints with JSON Web Tokens
- **Role-based Access Control**: Admin and User roles

## Technology Stack

- **Java 21**
- **Spring Boot 4.0.1**
- **Spring Data JPA**
- **Spring Security**
- **MySQL Database**
- **JWT (JSON Web Tokens)**
- **Lombok**
- **Maven**

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+ (or compatible database)

## Setup Instructions

### Option 1: Using Docker (Recommended)

1. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f bookstore-api
   ```

3. **The API will be available at `http://localhost:8080`**

   For detailed Docker setup instructions, see [README-Docker.md](README-Docker.md)

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookBE
   ```

2. **Configure Database**
   - Create a MySQL database named `bookstore_db`
   - Update `src/main/resources/application.properties` with your database credentials:
     ```properties
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main St"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    ...
  }
}
```

### Books

#### Get All Books
```
GET /api/books
```

#### Get Book by ID
```
GET /api/books/{id}
```

#### Search Books by Title
```
GET /api/books/search?title=spring
```

#### Get Books by Author
```
GET /api/books/author/{authorId}
```

#### Get Books by Category
```
GET /api/books/category/{categoryId}
```

#### Get Available Books
```
GET /api/books/available
```

#### Create Book (Requires Authentication)
```
POST /api/books
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Spring Boot in Action",
  "description": "A comprehensive guide to Spring Boot",
  "price": 49.99,
  "stock": 100,
  "isbn": "978-1617292545",
  "authorId": 1,
  "categoryIds": [1, 2]
}
```

#### Update Book
```
PUT /api/books/{id}
Authorization: Bearer {token}
```

#### Delete Book
```
DELETE /api/books/{id}
Authorization: Bearer {token}
```

### Authors

#### Get All Authors
```
GET /api/authors
```

#### Get Author by ID
```
GET /api/authors/{id}
```

#### Create Author
```
POST /api/authors
Content-Type: application/json

{
  "name": "John Smith",
  "biography": "Renowned author..."
}
```

#### Update Author
```
PUT /api/authors/{id}
```

#### Delete Author
```
DELETE /api/authors/{id}
```

### Categories

#### Get All Categories
```
GET /api/categories
```

#### Get Category by ID
```
GET /api/categories/{id}
```

#### Create Category
```
POST /api/categories
Content-Type: application/json

{
  "name": "Fiction",
  "description": "Fictional books"
}
```

#### Update Category
```
PUT /api/categories/{id}
```

#### Delete Category
```
DELETE /api/categories/{id}
```

### Orders

#### Get All Orders (Authenticated Users)
```
GET /api/orders
Authorization: Bearer {token}
```

#### Get Order by ID
```
GET /api/orders/{id}
Authorization: Bearer {token}
```

#### Get Orders by Status
```
GET /api/orders/status/{status}
Authorization: Bearer {token}
```

**Status values:** PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

#### Create Order
```
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, State",
  "items": [
    {
      "bookId": 1,
      "quantity": 2
    },
    {
      "bookId": 2,
      "quantity": 1
    }
  ]
}
```

#### Update Order Status
```
PUT /api/orders/{id}/status?status=SHIPPED
Authorization: Bearer {token}
```

#### Cancel Order
```
POST /api/orders/{id}/cancel
Authorization: Bearer {token}
```

### Users (Admin Only)

#### Get All Users
```
GET /api/users
Authorization: Bearer {admin_token}
```

#### Get User by ID
```
GET /api/users/{id}
Authorization: Bearer {admin_token}
```

#### Update User
```
PUT /api/users/{id}
Authorization: Bearer {admin_token}
```

#### Delete User
```
DELETE /api/users/{id}
Authorization: Bearer {admin_token}
```

## Security

- **Public Endpoints**: Authentication, Books (read), Authors (read), Categories (read)
- **Authenticated Endpoints**: Orders, Books (write), Authors (write), Categories (write)
- **Admin Only**: User management endpoints

## Database Schema

The application uses JPA entities that automatically create the following tables:
- `users` - User accounts and authentication
- `authors` - Book authors
- `categories` - Book categories
- `books` - Book inventory
- `book_categories` - Many-to-many relationship between books and categories
- `orders` - Customer orders
- `order_items` - Items in each order

## Configuration

Key configuration in `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db
spring.datasource.username=root
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000  # 24 hours in milliseconds
```

## Project Structure

```
src/main/java/com/example/bookbe/
├── entity/          # JPA entities
├── repository/      # Data access layer
├── dto/             # Data transfer objects
├── service/         # Business logic
├── controller/      # REST controllers
├── security/        # Security configuration
└── util/            # Utility classes
```

## Testing

Run tests with:
```bash
mvn test
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

