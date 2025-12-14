🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System designed to manage sweets inventory, user authentication, and purchase workflows.
This project was built as part of a placement assessment to demonstrate skills in frontend development, API design, authentication, clean architecture, and modern development practices.

The system supports role-based access, allowing normal users to browse and purchase sweets, while admins can manage inventory and sweet details.

🚀 Tech Stack
Frontend:
React (Vite)
TypeScript
Tailwind CSS
Context API for state management

Backend:
Node.js
Express
TypeScript
JWT Authentication
RESTful API architecture

Tooling & Testing
ESLint



✨ Features
👤 Authentication

User registration and login
JWT-based authentication
Role-based access control (USER, ADMIN)
Protected routes for authenticated users

🍭 Sweet Management
View all available sweets
Each sweet includes:
Name
Category
Price
Quantity in stock
Search and filter sweets by:
Name
Category
Price range

🛒 Inventory & Purchase
Purchase sweets (quantity decreases automatically)
Purchase button disabled when stock is zero
Prevents purchasing out-of-stock items

🛠️ Admin Features(Admin users only)
Add new sweets
Update sweet details
Delete sweets
Restock inventory
Secure admin-only API access

🎨 User Experience
Responsive and clean UI
Reusable components
Clear loading and error states
Simple and intuitive dashboard

📂 Project Structure
Frontend
src/
 ├── components/     # Reusable UI components
 ├── pages/          # Application pages
 ├── hooks/          # Custom React hooks
 ├── services/       # API service layer
 ├── types/          # Shared TypeScript types
 ├── lib/            # Utility helpers
 └── main.tsx

Backend
backend/
 ├── controllers/    # Request handlers
 ├── routes/         # API routes
 ├── services/       # Business logic
 ├── middleware/     # Auth & error handling
 ├── models/         # Data models
 ├── utils/          # JWT & helpers
 └── server.ts

⚙️ Setup & Run Locally
1️⃣ Clone Repository
git clone https://github.com/0NIKHIL4/candy-cloud-ctrl.git
cd candy-cloud-ctrl

2️⃣ Frontend Setup
npm install
npm run dev

3️⃣ Backend Setup
cd backend
npm install
npm run dev

🔐 API Overview (Backend)
Auth
POST /api/auth/register
POST /api/auth/login
Sweets
GET /api/sweets
POST /api/sweets (Admin)
PUT /api/sweets/:id (Admin)
DELETE /api/sweets/:id (Admin)
GET /api/sweets/search

Inventory
POST /api/sweets/:id/purchase
POST /api/sweets/:id/restock (Admin)

🤖 My AI Usage

AI tools were used selectively and responsibly to improve productivity and learning while maintaining full ownership of the final implementation.
AI Tools Used
Lovable AI
ChatGPT

How AI Was Used
Used Lovable AI to scaffold initial project setup and backend boilerplate.
Used Lovable AI heavily for backend API structure, authentication logic, and service/controller patterns.
Used ChatGPT occasionally for frontend best practices, TypeScript typing clarification, and debugging guidance.
All AI-generated code was reviewed, modified, and tested manually.

Reflection
AI helped accelerate setup and supported learning in backend development, allowing me to focus more on system integration, validation, and clean architecture.
AI was used as a support tool, not a replacement for understanding or implementation.

📌 Future Improvements

Add automated tests (unit & integration)
Connect production database
Improve UI animations
Add pagination for sweet listing

👨‍💻 Author
Nikhil Yadav
B.Tech Student | Aspiring Full-Stack Developer





Just say 👍
