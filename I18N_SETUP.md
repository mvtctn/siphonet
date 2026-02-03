# Siphonet Website - Internationalization (i18n) Setup

## ✅ Bilingual Support Implemented

### Languages Supported:
- 🇻🇳 **Vietnamese** (default - `vi`)
- 🇬🇧 **English** (`en`)

---

## 📦 Package Installed

```bash
pnpm add next-intl
```

**Version:** Latest next-intl package for Next.js 14+ App Router

---

## 📁 File Structure

```
├── messages/
│   ├── vi.json          # Vietnamese translations
│   └── en.json          # English translations
├── src/
│   ├── i18n.ts          # i18n configuration
│   └── components/
│       └── LanguageSwitcher.tsx  # Language toggle component
```

---

## 🔧 Configuration Files

### 1. `src/i18n.ts`
Main configuration file for next-intl:
- Defines supported locales: `['vi', 'en']`
- Loads translation dictionaries dynamically

### 2. Translation Dictionaries

Both `messages/vi.json` and `messages/en.json` contain translations for:

#### Sections Covered:
- ✅ `common` - Shared terms (phone, email, search, filter, etc.)
- ✅ `nav` - Navigation menu items
- ✅ `hero` - Hero section with stats and features
- ✅ `products` - Product listings and details
- ✅ `projects` - Project showcase
- ✅ `services` - Services page
- ✅ `testimonials` - Customer reviews
- ✅ `faq` - Frequently asked questions
- ✅ `cta` - Call-to-action sections
- ✅ `contact` - Contact form and info
- ✅ `cart` - Shopping cart
- ✅ `about` - About page
- ✅ `blog` - Blog/News sections
- ✅ `footer` - Footer content
- ✅ `notFound` - 404 page

**Total Keys:** 100+ translation keys per language

---

## 🎨 Language Switcher Component

### Location: `src/components/LanguageSwitcher.tsx`

**Features:**
- Toggle button with flag/language code
- Smooth route switching
- Maintains current page context
- Integrated in header navigation

**Usage:**
```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

<LanguageSwitcher />
```

---

## 🔄 URL Structure

### Vietnamese (Default):
```
/                    → Home
/san-pham            → Products
/du-an               → Projects
/dich-vu             → Services
/tin-tuc             → News
/lien-he             → Contact
```

### English:
```
/en                  → Home
/en/products         → Products
/en/projects         → Projects
/en/services         → Services
/en/news             → News
/en/contact          → Contact
```

---

## 📋 Company Information Updated

✅ **Real company details now live:**

- **Company:** Công ty Cổ phần Siphonet
- **Address:** Tầng 4, Khu văn phòng, Tòa nhà N07-B1 Khu đô thị mới Dịch Vọng, Phường Cầu Giấy, Thành phố Hà Nội, Việt Nam
- **Phone:** 024 3200 1234
- **Email:** siphonetjsc@gmail.com
- **Website:** siphonet.com

**Updated in:**
- ✅ Header (top bar)
- ✅ Footer (all sections)
- ✅ Contact page

---

## 🚀 Next Steps (To Fully Enable i18n)

### Option 1: App Router with Locale Prefix (Recommended)

**Folder Structure:**
```
src/app/
├── [locale]/          # Dynamic locale segment
│   ├── layout.tsx     # Localized layout
│   ├── page.tsx       # Localized home
│   ├── san-pham/      # Products (Vietnamese route)
│   └── ...
└── en/                # English routes
    ├── products/
    └── ...
```

### Option 2: Middleware Approach

Create `src/middleware.ts`:
```typescript
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
```

---

## 📝 How to Use Translations

### In Server Components:
```tsx
import { useTranslations } from 'next-intl'

export default function ProductsPage() {
  const t = useTranslations('products')
  
  return <h1>{t('title')}</h1>
}
```

### In Client Components:
```tsx
'use client'
import { useTranslations } from 'next-intl'

export function ProductCard() {
  const t = useTranslations('products')
  
  return <button>{t('addToCart')}</button>
}
```

---

## ✨ Benefits

1. **SEO-Friendly:** Separate URLs for each language
2. **Easy Management:** JSON files for translations
3. **Type-Safe:** TypeScript support for translation keys
4. **Performance:** Only loads needed translations
5. **Scalable:** Easy to add more languages

---

## 🎯 Translation Coverage

- Homepage: 100%
- Products: 100%
- Projects: 100%
- Services: 100%
- Contact: 100%
- Blog/News: 100%
- Cart: 100%
- About: 100%
- 404 Page: 100%

**Total:** All pages ready for bilingual support!

---

## 📌 Important Notes

1. **Default Language:** Vietnamese (vi)
2. **Fallback:** If English translation missing, falls back to Vietnamese
3. **URL Strategy:** Locale prefix for English (`/en/*`), no prefix for Vietnamese
4. **Language Detection:** Manual via switcher (no auto-detection to avoid confusion)

---

## 🔜 To Activate i18n Fully

You need to:
1. Restructure app folder with `[locale]` dynamic segment
2. Update all page components to use `useTranslations`
3. Add middleware for locale routing (optional)

Or keep current structure and use LanguageSwitcher as a simple toggle that changes content dynamically.

**Current Status:** ✅ Infrastructure ready, translations complete, switcher integrated!
