<div align="right">

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=Ryan-infitech.Tokotech-webApp)

</div>

# Toko Tech - Professional E-Commerce Platform

![Toko Tech](https://github.com/Ryan-infitech/Tokotech-webApp/blob/main/public/images/og-image.png?raw=true)

## Overview

Toko Tech is a full-stack e-commerce platform built with Next.js 14 and Express.js. It provides a modern shopping experience with comprehensive product management, secure checkout flows, and robust admin capabilities. The application uses a PostgreSQL database through Supabase for data storage and authentication services.

## Technology Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **UI Libraries**:
  - Tailwind CSS for styling
  - Headless UI for accessible components
  - Framer Motion for animations
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **API Communication**:
  - Axios for HTTP requests
  - SWR for data fetching and caching
- **Authentication**: NextAuth.js with JWT
- **Data Visualization**: Chart.js
- **Notification System**: React Hot Toast

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT with role-based access control
- **Security**: CORS with customized configuration
- **File Storage**: Supabase Storage
- **Email Service**: Nodemailer
- **File Upload**: Multer middleware
- **Validation**: Joi and Zod schemas
- **Logging**: Winston logger
- **Payment Processing**: Midtrans integration
- **Reporting**: Excel generation with ExcelJS

## Features

### Customer Features

- **User Authentication**
  - Email/password registration
  - JWT-based secure authentication
  - Password reset functionality
- **Product Browsing**
  - Advanced filtering and searching
  - Category-based navigation
  - Detailed product information
- **Shopping Experience**
  - Shopping cart with persistence
  - Wishlist functionality
  - Order tracking and history
- **Checkout Process**
  - Multiple payment methods through Midtrans
  - Shipping options and calculations
  - Order confirmation and receipt

### Admin Features

- **Dashboard**
  - Sales analytics and metrics
  - Customer insights
  - Inventory status
- **Product Management**
  - Product creation and editing
  - Inventory management
  - Image upload and management
- **Order Management**
  - Process and track orders
  - Update order status
  - Generate shipping information
- **User Management**
  - Customer account administration
  - Role-based access control
  - User status management
- **Reporting**
  - Revenue reports
  - Excel export functionality
  - Custom date range filtering

## Bit Of The Structure ...

```
.
├── Frontend                  # Frontend application
│   ├── public                # Public assets
│   ├── src                   # Source files
│   │   ├── app               # Next.js app directory
│   │   ├── components         # Shared components
│   │   ├── lib                # Library functions
│   │   ├── middleware         # Middleware functions
│   │   ├── pages             # Next.js pages
│   │   ├── styles            # Global styles
│   │   ├── utils             # Utility functions
│   │   └── ...  
│   ├── .env.local            # Local environment variables
│   └── .... 
├── Backend                   # Backend application
│   ├── config                # Configuration files
│   ├── controllers           # Request controllers
│   ├── middleware            # Middleware functions
│   ├── models                # Database models
│   ├── routes                # API routes
│   ├── services              # Business logic and services
│   ├── uploads               # File uploads
│   ├── .env                  # Environment variables
│   ├── server.js             # Entry point for the backend
│   └── ...
├── README.md                 # Project documentation
├── package.json              # Package configuration
└── ...
```


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for checking out Toko Tech! We hope this documentation helps you understand and contribute to the project. For any questions or feedback, please reach out to the maintainers.
