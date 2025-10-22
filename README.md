# Borrowed Money Tracker

A full-stack application for tracking borrowed money, repayments, and managing borrowers. Built with Spring Boot backend and React frontend.

## Features

- **Borrower Management**: Add and manage borrowers with their relationship information
- **Borrowing Tracking**: Track individual borrowings with interest rates and repayment dates
- **Repayment History**: Record and track all repayments
- **Upcoming Repayments**: View upcoming repayments with days remaining
- **Real-time Calculations**: Automatic calculation of totals, outstanding balances, and interest
- **Status Tracking**: Track borrower status (Pending, Partially Repaid, Repaid, Overdue)

## Backend (Spring Boot)

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Running the Backend
1. Navigate to the project root directory
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```cmd
   mvnw.cmd spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### API Endpoints
- `GET /api/borrowers` - Get all borrowers
- `POST /api/borrowers` - Create new borrower
- `GET /api/borrowings` - Get all borrowings
- `POST /api/borrowings` - Create new borrowing
- `GET /api/repayments` - Get all repayments
- `POST /api/repayments` - Create new repayment
- `GET /api/calc/total` - Calculate total with interest

## Frontend (React)

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Running the Frontend
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## Project Structure

```
├── src/
│   ├── main/
│   │   ├── java/com/Money/Lending/
│   │   │   ├── controller/     # REST API controllers
│   │   │   ├── model/         # JPA entities
│   │   │   ├── repository/    # Data repositories
│   │   │   ├── service/       # Business logic
│   │   │   └── config/        # Configuration
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql       # Sample data
│   └── test/                  # Test files
├── public/                    # Static files
├── src/                       # React frontend
│   ├── components/            # React components
│   ├── services/             # API service layer
│   └── App.js                # Main app component
├── package.json              # Frontend dependencies
└── pom.xml                   # Backend dependencies
```

## Database

The application uses H2 in-memory database for development. The database schema is automatically created based on the JPA entities, and sample data is loaded from `data.sql`.

## Features Overview

### Dashboard
- Overview of all borrowers with their current status
- Upcoming repayments with days remaining
- Total borrowed and repaid amounts
- Recent borrowing and repayment history

### Borrower Management
- Add new borrowers with relationship information
- View borrower statistics (total borrowed, repaid, outstanding)
- Filter borrowers by status
- Track interest rates and borrowing count

### Borrowing Management
- Create new borrowings with interest calculations
- Set borrowing and repayment dates
- Track borrowing status
- View all borrowings in a table format

### Repayment Tracking
- Record repayments against specific borrowings
- Add notes and dates for repayments
- View repayment history
- Calculate remaining balances

## Development

### Backend Development
- Uses Spring Boot with JPA/Hibernate
- RESTful API design
- CORS enabled for frontend communication
- H2 console available at `http://localhost:8080/h2-console`

### Frontend Development
- React with functional components and hooks
- Axios for API communication
- Responsive design with CSS Grid and Flexbox
- Modal forms for data entry

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
