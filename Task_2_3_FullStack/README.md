# Urban Harvest Hub

Urban Harvest Hub is a full-stack web application designed to connect urban communities with fresh, local produce and sustainable living workshops.

## Prerequisites

Before running the application, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Community Server)

## 1. Database Setup

1.  **Install and Run MongoDB**:
    *   Ensure MongoDB is installed and running on your machine.
    *   Standard connection string: `mongodb://localhost:27017/urban-harvest`

2.  **Environment Variables**:
    *   Navigate to the `Backend` directory:
        ```bash
        cd Backend
        ```
    *   Create a `.env` file (you can copy `.env.example` if it exists):
        ```
        PORT=5000
        MONGODB_URI=mongodb://127.0.0.1:27017/urbanharvest
        JWT_SECRET=your_jwt_secret_key_here
        ```

3.  **Seed the Database**:
    *   Populate the database with initial data (Products, Workshops, Events):
        ```bash
        node scripts/seed.js
        ```
    *   You should see a message confirming the data has been seeded.

## 2. Running the Application

### Backend (Server)

1.  Open a terminal and navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    *   For development with auto-restart: `npm run dev`
    *   The server will start on `http://localhost:5000`

### Frontend (Client)

1.  Open a **new** terminal and navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *   The application will be accessible at `http://localhost:5173`

## 3. Testing

### API Testing (Backend)

You can test the API endpoints using tools like [Postman](https://www.postman.com/) or `curl`.

*   **Base URL**: `http://localhost:5000/api`
*   **Sample Endpoints**:
    *   `GET /products` - Retrieve all products
    *   `GET /events` - Retrieve all events
    *   `GET /workshops` - Retrieve all workshops

### GUI Testing (Frontend)

1.  Open your browser and visit `http://localhost:5173`.
2.  **Navigation**: Use the navbar to explore Categories, Workshops, and Events.
3.  **Language**: Toggle the language button (e.g., FR/EN) to test translations.
4.  **Registration**:
    *   Click on an Event or Workshop.
    *   Click "Register Now" (you may need to login/signup first).
    *   Verify the booking flow.
5.  **Shopping**:
    *   Go to "Products".
    *   Add items to the cart.
    *   Proceed to checkout.

## Troubleshooting

*   **Database Connection Error**: Ensure the MongoDB service is running and the `MONGODB_URI` in `Backend/.env` is correct.
*   **Images Not Loading**: Ensure the seed script has been run and the images exist in `Frontend/public/Images`.
