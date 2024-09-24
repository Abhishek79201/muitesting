# Task Management Application

A web application built with React for the frontend and Node.js for the backend, enabling users to manage tasks efficiently. This application features user authentication using cookies and CRUD operations for tasks.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Frontend](#frontend)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
- [Backend](#backend)
  - [API Endpoints](#api-endpoints)
  - [Middleware](#middleware)
- [Optional Enhancements](#optional-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- User login and authentication via cookies.
- View a list of tasks associated with the authenticated user.
- Create, update, and delete tasks.
- Responsive user interface built with React.
- Middleware for route protection based on user authentication.

## Technologies Used

- **Frontend**: React, Ant Design, Redux Toolkit
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or your preferred database)
- **Authentication**: Cookies for session management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (or your chosen database)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone (https://github.com/Abhishek79201/taskdemo.git)
   cd task-management-app
   ```

In this implementation, cookie-based authentication is being used to store and manage the authentication token. Here's a step-by-step explanation of how cookie-based authentication is handled:

1.  User Registration (`signUp`)

- The `signUp` function sends a POST request to the backend API at `/auth/register` with the user data (name, email, password).
- If the registration is successful, the API returns a response that contains a token.
- The token is then stored in a cookie using the `Cookies.set('Authorization', token)` method, which places the authentication token into the browser's cookies.
- This token is used in subsequent requests to authenticate the user.
- The successful signup triggers a success message, and the `authSlice` updates the `token` and `user` state in the Redux store.

2.  User Login (`login`)

- The `login` function sends a POST request to the backend API at `/auth/login` with the user's email and password.
- If login is successful, the response contains a token, which is stored in the browser using `Cookies.set('Authorization', token)`.
- This token is then used to authenticate the user in subsequent API requests.
- The token and user information are stored in the Redux state after a successful login.

3.  Fetching the User Profile (`fetchProfile`)

- When fetching the user's profile, the `fetchProfile` function sends a request to `/auth/profile`.
- The token that was saved in the cookie during signup or login is retrieved using `Cookies.get('Authorization')`.
- This token is passed in the headers of the request (`Authorization: token`) to authenticate the user when fetching their profile data.
- If successful, the profile data is returned and the `authSlice` is updated with the user's information.

4.  Updating the User Profile (`updateProfile`)

- The `updateProfile` function sends a PUT request to `/auth/profile` to update the user's profile information (name, email, etc.).
- No token is retrieved or sent in this step because it's assumed that the user is already authenticated.
- The response from the API updates the user data in the Redux store.

5.  Logout / Clearing Authentication (`clearAuthState`)

- The `clearAuthState` action in the `authSlice` reducer clears the token and user from the Redux state when the user logs out.
- It also removes the token from the browser's cookies by calling `Cookies.remove('Authorization')`, effectively logging the user out of the system.

Key Elements of Cookie-Based Authentication:

1. Storing the Token in Cookies:

   - After a successful login or signup, the authentication token (JWT or similar) is stored in the browser as a cookie using `Cookies.set()`. This allows the token to persist between page reloads.

2. Using the Token in Requests:

   - In subsequent requests, the token is retrieved from the cookies using `Cookies.get()`. This token is then included in the headers of API requests to prove that the user is authenticated (`Authorization: token`).

3. Clearing the Token on Logout:
   - When the user logs out, the token is removed from the cookies using `Cookies.remove()`, ensuring that the user is no longer authenticated.

This approach provides the user with a persistent login session because the token is stored in the browser as a cookie. Additionally, cookies can be configured with options like expiration time, secure flag, and HTTP-only flag to enhance security.
