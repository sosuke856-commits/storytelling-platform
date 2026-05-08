# Grand Library - Intellectual Storytelling Platform

A sophisticated, minimalist collaborative storytelling platform focused on IP (Intellectual Property) creation and real-time writer collaboration.

## 🎨 Vision

- **Minimalist Design**: Dark mode, stoic aesthetic, distraction-free
- **IP Protection**: Proof of Ownership badges, automated legal notices
- **Real-time Collaboration**: Writer's Room with live chat for brainstorming
- **Intellectual Depth**: No social media clutter, focus on substance

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide React icons
- **Backend**: Supabase (PostgreSQL + Auth)
- **Real-time**: Supabase Realtime for Writer's Room chat
- **State**: Zustand for auth management

## 📋 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page (What-If feed)
│   ├── auth/
│   │   └── page.tsx        # Sign in/Sign up
│   ├── globals.css         # Global styles
├── lib/
│   └── supabase.ts         # Supabase client
├── store/
│   └── authStore.ts        # Zustand auth store
```

## 🎯 Core Features (Phase 1)

- ✅ User Authentication (email/password)
- ✅ Landing page with story grid
- ✅ Dark, minimalist UI
- ✅ Supabase integration

## 🔄 Upcoming Features (Phase 2)

- Story creation editor
- Story view with Writer's Room sidebar
- Real-time chat (Supabase Realtime)
- IP protection badges
- Legal notice footer

## 🛡️ IP Protection

Each story includes:
- Proof of Ownership badge (creator name + timestamp)
- Automated legal footer: "100% IP ownership resides with the creator [Username] as of [Timestamp]"

## 📱 Responsive Design

- Desktop: Full layout with all features
- Tablet: Adjusted grid and sidebar
- Mobile: Collapsible Writer's Room, optimized layout

## 🤝 Contributing

This is a personal project. For inquiries, contact the maintainer.

## 📄 License

All intellectual property rights reserved to creators.
