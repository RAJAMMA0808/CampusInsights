# CampusInsights - Comprehensive College Management System

A complete college management system with role-based access control, comprehensive dashboards, and data export capabilities for managing 3 engineering colleges.

## 🏫 System Overview

CampusInsights is designed for managing multiple engineering colleges with the following structure:

### Colleges
1. **Big Institute of Engineering and Technology (BIET)**
2. **Brilliant Institute of Engineering and Technology (BGIIG)**  
3. **Kasireddy Narayanreddy College of Engineering and Research (KNRCER)**

### Departments
- Computer Science and Engineering (CSE)
- Electronics and Communication Engineering (ECE)
- Electrical and Electronics Engineering (EEE)
- Mechanical Engineering (ME)
- Civil Engineering (CE)
- Artificial Intelligence and Machine Learning (AIML)
- Data Science (DS)
- Cyber Security (CS)

## 👥 Role-Based Access Control

### Chairman (Full Access)
- **Dashboard Access**: All 3 colleges overview and individual college dashboards
- **Student Search**: Search any student across all colleges by admission number
- **Data Export**: Export comprehensive reports in Excel and ZIP formats
- **Data Upload**: Upload attendance and marks data
- **Analytics**: View detailed KPIs and performance metrics

### HOD (Department-Limited Access)
- **Dashboard Access**: Limited to their college and department
- **Student Search**: Search students within their department
- **Data Upload**: Upload data for their department
- **Limited Analytics**: Department-specific metrics only

### Staff (Limited Access)
- **Dashboard Access**: Basic metrics for their college
- **Student Search**: Limited student information access
- **Data Upload**: Upload data with restrictions

## 📊 Dashboard Features

### All Colleges Overview Dashboard
- **Total Students**: Across all 3 colleges
- **Total Faculty**: Teaching staff count
- **Total Staff**: Administrative staff count
- **Pass Percentage**: Overall academic performance
- **Attendance Tracking**: Students, Faculty, and Staff attendance
- **Performance Metrics**: Real-time KPIs and analytics

### College-wise Dashboard
- Individual college performance metrics
- Department-wise breakdowns
- College-specific attendance and marks analysis
- Comparative analytics between colleges

### Student Search & Profile
- Search by admission number (e.g., KCSE202001, AIML202101)
- Complete student profile with:
  - Personal information
  - Attendance rate and history
  - Academic performance (CGPA)
  - Recent marks and grades
  - Performance analytics

## 📈 Key Performance Indicators (KPIs)

### Attendance Metrics
- **Students Present/Absent**: Daily attendance tracking
- **Faculty Present/Absent**: Teaching staff attendance
- **Staff Present/Absent**: Administrative staff attendance
- **Attendance Rates**: Percentage calculations with visual indicators

### Academic Performance
- **Pass Percentage**: Overall academic success rate
- **CGPA Tracking**: Individual student performance
- **Subject-wise Analysis**: Performance by subject
- **Semester-wise Trends**: Academic progress tracking

### College Analytics
- **Total Enrollments**: Student count by college and department
- **Faculty Strength**: Teaching staff distribution
- **Staff Distribution**: Administrative staff allocation
- **Performance Comparison**: Inter-college analytics

## 🎓 Student Management

### Admission Number System
- **CSE Students**: KCSE202001 to KCSE202060 (first year), KCSE202101 to KCSE202160 (second year), etc.
- **AIML Students**: AIML202001 to AIML202060 (first year), AIML202101 to AIML202160 (second year), etc.
- **Faculty Numbers**: KCSEF2021-21001 to 210100, BECEF2020-22001 to 220100, etc.
- **Staff Numbers**: GCSEF2020-23001 to 230100, etc.

### Student Data Structure
- Personal information (name, email, phone)
- Academic details (year, semester, department)
- Attendance records (daily tracking)
- Marks and grades (subject-wise performance)
- Performance analytics (CGPA, attendance rate)

## 📋 Data Management

### Excel Templates
- **Attendance Template**: Daily attendance recording
- **Marks Template**: Academic performance tracking
- **Student Template**: Student information management
- **Faculty Template**: Teaching staff data
- **Staff Template**: Administrative staff data

### Data Export Options
- **Excel Format**: Multi-sheet Excel files
- **ZIP Format**: Compressed archives with multiple files
- **Template Downloads**: Pre-formatted templates for data entry
- **Custom Date Ranges**: Flexible data export periods

## 🔧 Technical Features

### Database Schema
- **Users**: Role-based authentication
- **Colleges**: College information and management
- **Departments**: Department structure and hierarchy
- **Students**: Student records and academic data
- **Faculty**: Teaching staff information
- **Staff**: Administrative staff data
- **Attendance**: Daily attendance tracking
- **Marks**: Academic performance records
- **Audit Logs**: System activity tracking

### API Endpoints
- **Authentication**: Login/logout with role-based access
- **Dashboard**: KPI and analytics data
- **Student Search**: Individual student profiles
- **Data Export**: Excel and ZIP file generation
- **File Upload**: Attendance and marks data import
- **Template Download**: Pre-formatted templates

### Security Features
- **Role-based Access Control**: Different access levels
- **Audit Logging**: Complete activity tracking
- **Data Validation**: Input validation and sanitization
- **Session Management**: Secure authentication
- **Permission Checks**: API-level access control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Configure DATABASE_URL and SESSION_SECRET
   ```
4. Initialize the database:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Database Initialization
Run the initialization script to populate sample data:
```bash
npm run init-data
```

This will create:
- 3 colleges with 8 departments each
- Sample students, faculty, and staff
- Attendance records for the last 30 days
- Sample marks and grades
- Complete test data for all features

## 📱 User Interface

### Chairman Dashboard
- **Comprehensive Overview**: All colleges at a glance
- **Tabbed Interface**: Dashboard, Search, Export, Upload
- **Real-time KPIs**: Live attendance and performance metrics
- **College Comparison**: Side-by-side analytics
- **Export Tools**: Excel and ZIP download options

### Student Search Interface
- **Admission Number Search**: Quick student lookup
- **Detailed Profiles**: Complete academic information
- **Performance Analytics**: CGPA and attendance tracking
- **Recent Activity**: Latest marks and attendance records

### Data Export Interface
- **Multi-format Export**: Excel and ZIP options
- **Selective Data**: Choose specific data types
- **Date Range Filtering**: Custom export periods
- **Template Downloads**: Pre-formatted data entry templates

## 🔍 Usage Examples

### Chairman Login
1. Access the chairman dashboard
2. View all 3 colleges overview
3. Select specific college for detailed view
4. Search any student by admission number
5. Export comprehensive reports
6. Upload new data files

### Student Search
1. Enter admission number (e.g., KCSE202001)
2. View complete student profile
3. Check attendance rate and history
4. Review academic performance
5. Download individual reports

### Data Export
1. Select data types (students, attendance, marks, etc.)
2. Choose colleges and date ranges
3. Select export format (Excel or ZIP)
4. Download comprehensive reports
5. Use templates for data entry

## 📊 Sample Data Structure

### Attendance Records
```
CollegeCode | ProgramCode | AdmissionNumber | StudentName | Gender | Semester | Date | MorningAttendance | EveningAttendance
KNRCER     | CSE         | KCSE202001     | Aarav Kapoor| M      | 1        | 2025-01-15 | Present | Present
```

### Marks Records
```
CollegeCode | ProgramCode | AdmissionNumber | StudentName | Gender | Semester | SubjectCode | SubjectName | ExamType | MarksObtained | MaxMarks
KNRCER     | CSE         | KCSE202001     | Aarav Kapoor| M      | 1        | CSE101      | Mathematics | Mid1     | 28           | 40
```

## 🛠️ Development

### Project Structure
```
CampusInsights/
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared types and schemas
└── docs/           # Documentation
```

### Key Components
- **Comprehensive Dashboard**: Multi-college analytics
- **Student Search**: Advanced student lookup
- **Data Export**: Excel and ZIP generation
- **File Upload**: Data import functionality
- **Role-based UI**: Dynamic interface based on user role

## 📝 License

This project is proprietary software developed for educational institution management.

## 🤝 Support

For technical support or feature requests, contact the development team.

---

**CampusInsights** - Complete College Management Solution

