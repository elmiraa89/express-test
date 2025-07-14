

# Kada-ch2 Blog API Server

A simple RESTful API built with **Node.js**, **Express**, **MongoDB** (via Mongoose), enabling users to manage blog posts and comments.  
This project is suitable for personal blogs, forums, and as a learning starter for modern MERN applications.

## 🚀 Features

- CRUD operations for **blog posts**
- CRUD operations for **comments** (linked to posts)
- MongoDB as the database, using Mongoose for schema modeling
- Modular code structure for scalability
- Ready for authentication via Passport.js (coming soon!)
- CORS enabled for frontend integration (e.g., with Vite + React)

---

## 🏗️ Tech Stack

- **Node.js** + **Express** (API server)
- **MongoDB** (database)
- **Mongoose** (ODM)
- **dotenv** (environment variable management)
- **CORS** (for cross-origin support)

---

## 📂 Project Structure

```
.
├── models/
│   ├── Post.js
│   └── Comment.js
├── routes/
│   ├── posts.js
│   └── comments.js
├── .env             # environment variables
├── index.js         # main entry (Express server)
└── README.md        # documentation
```

---

## ⚡ Getting Started

### 1. **Clone & Install**
```bash
git clone https://github.com/yourusername/kadach2-server.git
cd kadach2-server
npm install
```

### 2. **Environment Variables**

Create a `.env` file in the root with:

For local MongoDB:
```
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/kada-ch2
DATABASE_NAME='kada-ch2'
PORT=5000
```

Or with MongoDB Atlas:
```
MONGODB_CONNECTION_STRING=mongodb+srv://USERNAME:PASSWORD@yourcluster.mongodb.net/
DATABASE_NAME='kada-ch2'
PORT=5000
```

### 3. **Run the Server**
```bash
npm run dev      # if using nodemon
# or
node index.js
```
Expect to see:
```
MongoDB connected
Server running on port 5000
```

---

## 🔗 API Endpoints

### **Posts**

| Method | Endpoint                 | Description           |
|--------|-------------------------|-----------------------|
| GET    | `/posts`                | List all posts        |
| GET    | `/posts/:id`            | Get single post       |
| POST   | `/posts`                | Create a post         |
| PUT    | `/posts`                | Update a post         |
| DELETE | `/posts/:id`            | Delete a post (+comments) |

### **Comments**

| Method | Endpoint          | Description           |
|--------|------------------|-----------------------|
| GET    | `/posts/:id/comments` | List comments for a post   |
| POST   | `/comments`           | Add a comment to a post    |
| PUT    | `/comments/:id`       | Edit a comment             |
| DELETE | `/comments/:id`       | Delete a comment           |

#### **Request/Response Examples**

**Create a Post**

Request:
```json
POST /posts
Content-Type: application/json

{
  "title": "Hello World",
  "content": "My very first post!"
}
```

---

**Add a Comment**

Request:
```json
POST /comments
Content-Type: application/json

{
  "content": "Great post!",
  "post": "POST_OBJECT_ID_HERE"
}
```

---

## 🖥️ Cross-Origin (CORS)

CORS is enabled (`http://localhost:5173`) by default for easy local development with Vite + React.

---

## 🚦 Environment

- **Node.js** 18+ recommended
- **MongoDB** local or Atlas

---

## ✨ Next Steps

- [ ] User authentication (Passport.js)
- [ ] Authorization (only the author can edit/delete)
- [ ] Input validation & better error messages
- [ ] Rate limiting/throttling

---

## 📝 License

MIT © 2025 [Your Name ???]
