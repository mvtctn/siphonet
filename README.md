# Siphonet Website

> Website giới thiệu công ty, danh mục dự án và cửa hàng thiết bị cơ điện M&E - Công ty cổ phần Siphonet

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **CMS**: Payload CMS 3.0 (Admin tại `/admin`) - _Đang cấu hình_
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Payment**: PayOS với VietQR
- **Styling**: Tailwind CSS (Navy & Cyan theme)
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: Zustand (for shopping cart)
- **Language**: TypeScript + Vietnamese

## 📦 Installation

### Prerequisites
- Node.js >= 18.17.0
- PNPM (already installed globally)
- Supabase Account

### Setup

1. **Clone repository** (nếu có)
   ```bash
   git clone <repository-url>
   cd website-siphonet
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Supabase** 
   Xem hướng dẫn chi tiết trong [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

4. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   
   Điền các thông tin:
   - Database URL từ Supabase
   - Supabase API keys
   - Payload CMS secret
   - PayOS credentials (sau khi đăng ký tại payos.vn)

5. **Run development server**
   ```bash
   pnpm dev
   ```
   
   Mở http://localhost:3000

## 📁 Project Structure

```
website-siphonet/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout với SEO
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global styles (Navy & Cyan)
│   │   ├── san-pham/            # Products pages
│   │   ├── du-an/               # Projects showcase
│   │   ├── gio-hang/            # Shopping cart
│   │   └── dat-hang/            # Checkout
│   ├── collections/             # Payload CMS collections
│   │   ├── Products.ts          # Products với technical specs
│   │   ├── Projects.ts          # Dự án đã thực hiện
│   │   ├── Orders.ts            # Order management
│   │   ├── Pages.ts             # Landing page builder
│   │   ├── Reviews.ts           # Product reviews
│   │   ├── FAQs.ts              # Câu hỏi thường gặp
│   │   ├── TeamMembers.ts       # Team profiles
│   │   └── Testimonials.ts      # Client feedback
│   ├── components/
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── layout/              # Header, Footer, Nav
│   │   ├── home/                # Homepage sections
│   │   ├── products/            # Product components
│   │   └── shared/              # Reusable components
│   ├── lib/
│   │   ├── utils.ts             # Helper functions
│   │   ├── supabase.ts          # Supabase client
│   │   ├── payos.ts             # PayOS integration
│   │   └── cart.ts              # Cart state (Zustand)
│   └── types/                   # TypeScript definitions
├── public/                      # Static assets
├── REACT_BEST_PRACTICES.md     # Development guidelines
├── SUPABASE_SETUP.md           # Supabase configuration guide
└── package.json
```

## 🎨 Design System

### Colors (Navy & Cyan Theme)
- **Primary Navy**: `#0f172a` (slate-900)
- **Accent Cyan**: `#06b6d4` (cyan-500)
- **Gradients**: `gradient-navy-cyan`, `gradient-navy-cyan-radial`

### Typography
- **Font**: Inter (với Vietnamese subset)
- **Usage**: `font-sans` class

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm clean        # Clean and reinstall dependencies
```

### Adding Shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### React Best Practices
Xem [REACT_BEST_PRACTICES.md](./REACT_BEST_PRACTICES.md) để biết:
- Server vs Client Components
- TypeScript patterns
- State management
- Performance optimization

## 📋 Features

### ✅ Implemented
- Next.js 15 project structure & Tailwind CSS (Navy & Cyan theme)
- Supabase Integration (Database & Auth)
- Full Public Pages (Home, Products, Projects, Blog, Contact, Cart)
- Admin Dashboard (Post, Product, Category, Menu management)
- Multi-language support (Vietnamese/English setup)
- Mock & Real data integration via API routes

### 🚧 In Progress  
- PayOS Checkout & Order Management
- Supabase Storage for Image Uploads
- Full i18n for dynamic content

### 📅 Planned
- SEO Optimization (Sitemap, Metadata, JSON-LD)
- Customer Accounts & Wishlist
- Email/Telegram Notifications for Orders
- Google Analytics integration

### 📊 Project Architecture & Roadmap
- [🗺️ Sơ đồ trang web (Sitemap)](./SITEMAP.md)
- [📅 Lộ trình dự án (Roadmap)](./PROJECT_ROADMAP.md)

## 🗄️ Database Collections

| Collection | Mô tả | Fields |
|-----------|-------|--------|
| Products | Sản phẩm M&E | Tên, ảnh, specifications table, giá, tồn kho |
| Projects | Dự án đã thực hiện | Tên, ảnh, mô tả kỹ thuật, khách hàng, vị trí |
| Orders | Đơn hàng | Thông tin KH, items, payment status (PayOS) |
| Pages | Landing pages | Page builder với flexible blocks |
| Reviews | Đánh giá sản phẩm | Rating, comment, verified badge |
| FAQs | Câu hỏi | Question, answer, category |
| TeamMembers | Đội ngũ | Tên, vị trí, ảnh, bio |
| Testimonials | Phản hồi | Client name, feedback, rating |

## 🔐 Environment Variables

Xem [.env.example](./.env.example) để biết list đầy đủ.

**Required:**
- `DATABASE_URL` - Supabase PostgreSQL connection
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `PAYLOAD_SECRET`

**Optional (cho production):**
- `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`
- SMTP settings cho email notifications

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [React Best Practices](./REACT_BEST_PRACTICES.md)
- Content Management Guide - _Coming soon_

## 🤝 Contributing

Xem [REACT_BEST_PRACTICES.md](./REACT_BEST_PRACTICES.md) trước khi code.

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Server Components by default
- Vietnamese language for all UI text

## 📞 Contact

**Công ty cổ phần Siphonet**  
Website: siphonet.com  
Email: admin@siphonet.com

## 📄 License

Private - Siphonet Internal Project

---

**Developed with ❤️ using Next.js 15, Payload CMS & Supabase**
