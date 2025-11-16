

# EliteZ: Inventory Fulfillment and Distribution Platform

EliteZ is a B2B e-commerce and inventory management platform that connects companies (manufacturers) with shop owners (retailers) for product distribution, order management, analytics, and communication.

---

## Features
- Multi-role system: Admin, Company, Customer (Shop)
- Registration and approval workflow for companies and shops
- Product management (add, update, delete, view)
- Shopping cart and order placement
- Invoice and payment processing
- Order tracking and delivery management
- Messaging and notifications
- Analytics dashboard with charts
- Email integration for notifications

---

## Tech Stack
- **Frontend:** React.js (Vite, Material-UI, Bootstrap, Chart.js)
- **Backend:** PHP (REST API), MySQL
- **Other:** PHPMailer, CORS, JWT/session-based authentication

---

## Project Structure

```
Project-1/
├── .git/                     # Git version control
├── .gitignore               # Git ignore file
├── .htaccess               # Apache configuration
├── backend/                 # PHP API and business logic
│   ├── .env.example        # Sample environment file for email credentials
│   ├── api/                # All PHP endpoints
│   │   ├── Admin/          # Admin panel endpoints
│   │   │   ├── Addcompany.php
│   │   │   ├── Addcustomer.php
│   │   │   ├── barchart.php
│   │   │   ├── chart.php
│   │   │   ├── count.php
│   │   │   ├── deletecompany.php
│   │   │   ├── deletecustomer.php
│   │   │   ├── Getrequestcompany.php
│   │   │   ├── Getrequestcustomer.php
│   │   │   ├── Listcompany.php
│   │   │   ├── Listcustomer.php
│   │   │   ├── Listproducts.php
│   │   │   ├── Recentorder.php
│   │   │   ├── Requestcompany.php
│   │   │   ├── requestcompanyCounts.php
│   │   │   ├── Requestcustomer.php
│   │   │   └── requestcustomerCounts.php
│   │   ├── Company/         # Company endpoints
│   │   │   ├── add_product.php
│   │   │   ├── bar_chart.php
│   │   │   ├── connect.php
│   │   │   ├── counts.php
│   │   │   ├── customer_detail.php
│   │   │   ├── delete_product.php
│   │   │   ├── markAsRead.php
│   │   │   ├── product_review.php
│   │   │   ├── send_otp.php
│   │   │   ├── unread.php
│   │   │   ├── update_delivery_date.php
│   │   │   ├── update_order_status.php
│   │   │   ├── update_product.php
│   │   │   ├── update_profile.php
│   │   │   ├── view_orders.php
│   │   │   ├── view_product.php
│   │   │   ├── LoginRegister/
│   │   │   │   └── checkCompany.php
│   │   │   ├── Message/
│   │   │   │   ├── contact.php
│   │   │   │   ├── markAsRead.php
│   │   │   │   ├── message_detail.php
│   │   │   │   ├── message_list.php
│   │   │   │   └── unread.php
│   │   │   └── review/
│   │   │       ├── review.php
│   │   │       └── reviewdata.php
│   │   ├── config/          # Legacy config (CORS)
│   │   │   └── cors.php
│   │   ├── Connection/      # Database connection scripts
│   │   │   ├── connection.php
│   │   │   └── DbConnector.php
│   │   ├── Customer/        # Customer endpoints
│   │   │   ├── action.php
│   │   │   ├── add_cart_item.php
│   │   │   ├── cart_items.php
│   │   │   ├── check_cart_item.php
│   │   │   ├── generate_invoice.php
│   │   │   ├── get_order_details.php
│   │   │   ├── orders.php
│   │   │   ├── payment.php
│   │   │   ├── place_order.php
│   │   │   ├── Products.php
│   │   │   ├── remove_cart_item.php
│   │   │   ├── reviewdata.php
│   │   │   ├── update_cart_quantity.php
│   │   │   ├── update_profile.php
│   │   │   └── Message/
│   │   │       ├── message_info.php
│   │   │       ├── message_list.php
│   │   │       ├── message_read.php
│   │   │       ├── message_unread.php
│   │   │       └── send_message.php
│   │   ├── Home/            # Authentication and general endpoints
│   │   │   ├── ChangePassword.php
│   │   │   ├── emailVerification.php
│   │   │   ├── forgotpassword.php
│   │   │   ├── getProducts.php
│   │   │   ├── getUserDetails.php
│   │   │   ├── Login.php
│   │   │   ├── register.php
│   │   │   ├── resetpassword.php
│   │   │   ├── save_email.php
│   │   │   └── User.php
│   │   └── Phpmailer/       # Email sending library
│   │       ├── src/
│   │       ├── language/
│   │       └── ...
│   └── config/              # Configuration files
│       ├── email_config.php # Centralized email config (uses env vars)
│       └── env_loader.php   # Loads .env variables
├── frontend/                # React app (Vite)
│   ├── .eslintrc.cjs       # ESLint configuration
│   ├── index.html          # Main HTML file
│   ├── package.json        # Frontend dependencies and scripts
│   ├── package-lock.json   # Lock file for dependencies
│   ├── README.md           # Frontend-specific readme
│   ├── vite.config.js      # Vite configuration
│   ├── public/             # Static assets
│   │   ├── Asset 5.svg
│   │   ├── contact.jpg
│   │   ├── Elitez.png
│   │   ├── Elitez.svg
│   │   ├── Elitez1.png
│   │   ├── login1.jpg
│   │   ├── reg.jpg
│   │   ├── vite.svg
│   │   ├── files/
│   │   │   └── message/
│   │   └── images/
│   │       ├── faq-bg.jpg
│   │       ├── home-bg.jpg
│   │       ├── login-bg.jpg
│   │       ├── company/
│   │       ├── customer/
│   │       ├── home/
│   │       └── products/
│   └── src/                # React source code
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── components/
│           ├── Admin/
│           ├── Company/
│           ├── Customer/
│           └── Home/
├── elitez_database.sql     # Database schema (import this to MySQL)
├── README.md               # Main project documentation
├── CONTRIBUTORS.md         # List of contributors
└── LICENSE                 # Project license (MIT)
```

---

## Getting Started

### Prerequisites
- Node.js & npm
- PHP >= 7.4 (with PDO MySQL extension enabled)
- MySQL

### Setup
1. **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd Project-1
    ```
2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```
   > All dependencies for the React app are managed in `frontend/package.json`. There is no root-level `package.json`.
3. **Configure backend:**
    - Set up your MySQL database and update credentials in `backend/api/Connection/connection.php`.
    - Import the database schema using the provided `elitez_database.sql` file:
       ```bash
       mysql -u root -p < elitez_database.sql
       ```
    - Make sure the PHP extension `pdo_mysql` is enabled in your `php.ini` (remove the `;` from `extension=pdo_mysql`).
    - **Configure email settings:**
      - Copy `backend/.env.example` to `backend/.env`
      - Update the email configuration in `backend/.env` with your SMTP credentials:
        ```
        SMTP_USERNAME=your-email@gmail.com
        SMTP_PASSWORD=your-app-password
        FROM_EMAIL=your-email@gmail.com
        ```
      - For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.
4. **Run the frontend:**
    ```bash
    npm run dev
    ```
5. **Run the backend:**
         - Open a terminal in your project root and run:
            ```bash
            php -S localhost:8080
            ```
         - If you use XAMPP/WAMP, make sure to set the document root to the `backend/` folder and configure the port to 8080 to match the frontend API calls. Otherwise, it is recommended to use:
            ```bash
            php -S localhost:8080
            ```
            for consistent results.

---

## Usage
- Access the frontend at `http://localhost:5173`
- The backend API runs at `http://localhost:8080/backend/api/`
- Register as a company or shop, wait for admin approval, then log in to access your dashboard.
- Default test credentials (after importing the SQL):
   - Admin: `admin@elitez.com` / `password`
   - Company: `company@elitez.com` / `password`
   - Customer: `customer@elitez.com` / `password`

---

## Database
- The full schema is in `elitez_database.sql`.
- Key tables: `admins`, `companyowners`, `customers`, `registration_requests`, `products`, `orders`, `orderitems`, `invoices`, `payments`, `cart_items`, `contact`, `product_reviews`, `review_table`, `subscriptions`.
- All foreign key relationships and sample data are included.

---

## Troubleshooting


### Common Issues
- **Network Error / Connection Refused:**
   - Make sure your PHP backend server is running on port 8080.
   - Make sure your MySQL server is running and credentials are correct.
- **PDO Error: could not find driver:**
   - If you only see `php.ini-development` and `php.ini-production` in your PHP folder (e.g., `C:/php`), copy one of them and rename the copy to `php.ini`.
   - Open the new `php.ini` in a text editor.
   - Find the line: `;extension=pdo_mysql` and remove the `;` so it becomes `extension=pdo_mysql`.
   - Save the file.
   - Restart your PHP server after making changes.
   - Run `php -m` and check that `pdo_mysql` appears in the list.
- **Login not working:**
   - Check browser console and PHP error logs for details.
   - Make sure the database is imported and has the correct tables and sample data.
- **Email not sending:**
   - Make sure you have configured the email settings in `backend/.env`.
   - For Gmail, use an App Password instead of your regular password.
   - Check that your email credentials are correct and the SMTP server is accessible.

### Useful Commands
- Check PHP version: `php -v`
- Check enabled PHP extensions: `php -m`
- Start PHP server (from project root):
   ```bash
   php -S localhost:8080
   ```
- Import database: `mysql -u root -p < elitez_database.sql`

---

## Folder Details
- `frontend/` - React app source code
- `backend/api/` - PHP API endpoints for Admin, Company, Customer, etc.
- `backend/Connection/` - Database connection scripts
- `backend/config/` - CORS and config files
- `backend/Phpmailer/` - Email sending library
- `elitez_database.sql` - MySQL database schema and sample data

---

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---


## Contributors
Main contributors:

- Krisnaraj Navaraththinasingam — https://github.com/nkrisnaraj
- Sarujanan — https://github.com/saruj26
- Nihashini Subatharan — https://github.com/nihasuba
- Abarna Kumarasamy — https://github.com/AbarnaKumarasamy1122
- Risnariha — https://github.com/risnariha

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for more details.

---

## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
