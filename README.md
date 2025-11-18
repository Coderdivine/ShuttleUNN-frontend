# ShuttleUNN Frontend

A comprehensive campus shuttle payment and tracking system for the University of Nigeria, Nsukka (UNN), featuring NFC card payments, wallet management, and real-time session tracking.

## 🚀 Features

### Student Features
- User Authentication: Register, login, and profile management
- Wallet Management: View balance, top-up via Paystack
- NFC Card Request: Request and manage NFC cards for tap payments
- Session Booking: Book shuttle sessions with different time plans
- Session History: View all past, active, and upcoming sessions
- Refund Requests: Request refunds for unsatisfactory services

### Driver Features
- Driver Dashboard: View statistics and earnings
- Tap Payment: Process NFC card payments for students
- Transaction History: Track all processed payments
- Weekly Analytics: View passenger counts and trip statistics

### Admin Features
- System Overview: Monitor total students, drivers, cards, and revenue
- Card Management: Approve NFC card requests and assign cards
- Refund Management: Review and approve refund requests
- User Management: Manage students and drivers
- Transaction Monitoring: View all system transactions

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Fonts**: Geist Sans & Geist Mono

## 📦 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💳 Payment Plans

- **2hr Plan**: ₦200 (2 hours)
- **4hr Plan**: ₦400 (4 hours)
- **Night Plan**: ₦500 (10:00pm - 08:00am) - Most Popular

## 📁 Project Structure

```
frontend/
├── app/
│   ├── admin/dashboard/        # Admin dashboard
│   ├── driver/dashboard/       # Driver dashboard
│   ├── student/                # Student pages
│   ├── login/                  # Login page
│   └── page.tsx                # Home page
├── components/                 # Reusable components
├── lib/                        # Utilities and data
└── public/                     # Static assets
```

## 🎯 User Roles

1. **Student**: Book sessions, manage wallet, request cards
2. **Driver**: Process payments, view earnings
3. **Admin**: Manage system, approve requests

## 🔄 Current Status

✅ All UI pages built with dummy data
✅ Responsive design (desktop, tablet, mobile)
✅ Authentication flows
✅ Dashboard layouts
✅ Booking system UI
✅ Payment processing UI
⏳ Backend integration pending
⏳ Real payment gateway integration pending
⏳ NFC card writing/reading pending

## 📝 Next Steps

1. Build backend API with Node.js and MongoDB
2. Integrate Paystack for payments
3. Implement NFC card reading/writing
4. Connect all API endpoints
5. Add real-time features
6. Deploy to production

---

Built with ❤️ for University of Nigeria, Nsukka
