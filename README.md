# Nike E-commerce Store

A modern e-commerce application built with Next.js, TypeScript, TailwindCSS, and Drizzle ORM, featuring a Nike product catalog.

## Features

- 🛍️ **Product Catalog**: Browse Nike products with detailed information
- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS
- 🗄️ **Database**: PostgreSQL with Neon and Drizzle ORM
- 🚀 **Performance**: Built with Next.js 15 and App Router
- 📱 **Responsive**: Mobile-first design approach
- 🛒 **Shopping Cart**: Add products to cart with Zustand state management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **State Management**: Zustand
- **Authentication**: Better Auth (configured but not implemented)
- **Icons**: Heroicons

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database account

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nike-ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your database:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual database credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Auth
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"

# Neon Database (replace with your actual credentials)
NEON_DATABASE_URL="postgresql://username:password@host:port/database"
```

### 4. Database Setup

Generate and run database migrations:

```bash
# Generate migration files
npm run db:generate

# Run migrations (you'll need to manually run the SQL in your database)
npm run db:migrate

# Seed the database with sample Nike products
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application includes a `products` table with the following structure:

- `id`: Primary key
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `category`: Product category (e.g., Sneakers, Athletic Wear)
- `brand`: Brand name
- `imageUrl`: Product image URL
- `sizes`: Available sizes array
- `colors`: Available colors array
- `inStock`: Stock availability
- `rating`: Product rating
- `reviewCount`: Number of reviews
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   │   └── products/   # Products API endpoint
│   └── page.tsx        # Homepage
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── ProductCard.tsx # Individual product display
│   └── ProductGrid.tsx # Products grid layout
├── db/                 # Database configuration
│   ├── index.ts        # Database connection
│   ├── schema.ts       # Database schema
│   └── seed.ts         # Sample data
└── store/              # State management
    └── useStore.ts     # Zustand store
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
