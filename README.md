# Laravel E-Shop

A modern e-commerce application built with Laravel 12, Inertia.js, React 19, and Tailwind CSS 4.

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js & npm
- MySQL/PostgreSQL/SQLite (or any supported database)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/idehen-divine/E-Shop.git
   cd E-Shop
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database**

   Edit `.env` file and set your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run database migrations**
   ```bash
   php artisan migrate
   ```

6. **Set up the application**
   ```bash
   php artisan eshop:setup
   ```

## Running the Application

### Development Mode

The easiest way to run the application in development is using the provided composer script:

```bash
composer dev
```

This command will start all necessary services concurrently:
- **Laravel development server** (http://localhost:8000)
- **Queue worker** (for processing background jobs)
- **Scheduler** (for running scheduled tasks)
- **Application logs** (Pail)
- **Vite dev server** (for hot module replacement)

### Manual Setup

If you prefer to run services individually:

1. **Start the Laravel server**
   ```bash
   php artisan serve
   ```

2. **Start the Vite dev server** (in a new terminal)
   ```bash
   npm run dev
   ```

3. **Start the queue worker** (optional, in a new terminal)
   ```bash
   php artisan queue:work
   ```

4. **Start the scheduler** (optional, in a new terminal)
   ```bash
   php artisan schedule:work
   ```

## Building for Production

```bash
npm run build
```

For SSR (Server-Side Rendering):
```bash
npm run build:ssr
composer dev:ssr
```

## Testing

```bash
composer test
```

## Code Quality

### Format code
```bash
npm run format
```

### Lint code
```bash
npm run lint
```

### Fix code style (PHP)
```bash
vendor/bin/pint
```

## Features

- User authentication (Laravel Fortify)
- Product catalog with categories
- Shopping cart functionality
- Permission-based access control
- Background job processing
- Daily sales reports
- Low stock notifications

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React 19 + Inertia.js v2
- **Styling**: Tailwind CSS 4
- **Type Safety**: Laravel Wayfinder (TypeScript route bindings)
- **Testing**: PHPUnit
- **Code Quality**: Laravel Pint, ESLint, Prettier

## License

MIT
