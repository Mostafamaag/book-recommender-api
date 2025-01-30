# Book Recommender System

This is a **NestJS-based Book Management System** that provides **authentication, authorization, and role-based access control**. Users can **sign up, log in, read books, and track their reading sessions**. Admins can **manage books** with full **CRUD** operations. The system also tracks the most popular books based on **unique read pages**.



##  Features
-  **User Authentication & Authorization** (JWT-based)
-  **Role-Based Access Control** (User, Admin)
-  **User Features**
    - Register & Login (covered by unit testing)
    - Read books and track reading sessions
-  **Admin Features**
    - Add, Update and Delete books
- **System Features**
  - Get top 5 most popular books
  - Secure authentication and authorization
  - Data validation and error handling


##  Technology Used
- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL / TypeORM
- **Authentication:** JWT (JSON Web Token)

---

##  Installation
```bash
git clone https://github.com/mostafamaag/book-recommender-api
cd book-recommender-api
npm install

create a .env file in the root directory and add the following:
DB_PORT = 
DB_HOST = 
DB_DATABASE = 
DB_USERNAME = 
DB_PASSWORD = 
JWT_SECRET =


npm run start
