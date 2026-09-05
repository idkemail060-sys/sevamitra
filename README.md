
# SevaMitra 🤝

> **A smart, trusted and transparent platform for connecting households with verified local service workers.**

SevaMitra is a modern web application designed to make it easier for households to discover and hire suitable local workers while helping workers find relevant service opportunities.

The platform combines a role-based user experience, cloud-backed data management, AI capabilities, worker matching, transparent fee calculations and an admin workflow into a single application.

---

## 🌟 Why SevaMitra?

Finding a reliable local worker can be difficult because users often depend on informal recommendations, while skilled workers may struggle to find consistent opportunities.

SevaMitra aims to solve this gap by providing a digital platform where:

- 🏠 Households can find workers for required services.
- 👷 Workers can manage their profiles and service availability.
- 🧠 A matching engine ranks suitable workers.
- 🤖 AI capabilities can assist users with intelligent interactions.
- 💰 Pricing/fee calculations are made transparent.
- 🛡️ Admin functionality supports platform management.
- ☁️ Supabase provides backend/database capabilities.

---

## ✨ Key Features

### 🏠 Household / User Module

- User-friendly household dashboard
- Search and discover available workers
- Select service categories
- Match users with suitable workers
- View worker information and ratings
- Manage service requests
- Track relevant booking/request information
- Payment-related workflow support

### 👷 Worker Module

- Worker profile management
- Service/category information
- Availability handling
- Worker rating information
- Locality/pincode-based matching
- Opportunity/request management

### 🧠 Smart Worker Matching

SevaMitra includes a dedicated matching engine that evaluates workers using multiple factors instead of simply returning a random or alphabetical list.

The matching logic considers factors such as:

- Service/category compatibility
- Locality/pincode compatibility
- Worker rating
- Availability
- Fairness/rotation considerations

Workers are then ranked to help surface more relevant candidates while avoiding a system where the same workers are repeatedly favored.

> **Goal:** balance relevance, quality and fairness.

### 🤖 AI Integration

The application includes Google's Gemini/GenAI SDK for AI-powered functionality.

AI can be extended to support:

- Natural-language assistance
- Service discovery
- User guidance
- Intelligent recommendations
- Future conversational features

### 💰 Transparent Fee Calculation

The project contains logic for calculating and splitting service-related fees, helping create a more transparent transaction model between the platform, household and worker.

### 🛡️ Admin Module

Administrative functionality is included for managing platform-level operations and maintaining control over the service ecosystem.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | Radix UI |
| Icons | Lucide React |
| Animation | Motion |
| Backend / Data | Supabase |
| AI | Google Gemini / `@google/genai` |
| Server Utilities | Express |
| Package Manager | Bun / npm-compatible workflow |
| Deployment | Vercel-ready |

The repository uses React, TypeScript and Vite, with Supabase, Google GenAI, Tailwind CSS and supporting UI libraries listed in `package.json`.

---

## 🧩 Architecture Overview

```text
                         ┌─────────────────────┐
                         │      SevaMitra      │
                         │     Web Client      │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ React + TypeScript  │
                         │       + Vite        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌──────────────┐      ┌─────────────┐
       │   Supabase  │       │ Matching      │      │   Gemini /  │
       │ Auth + Data │       │    Engine     │      │   GenAI     │
       └─────────────┘       └──────────────┘      └─────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ Household / Worker │
                         │ / Admin Experience  │
                         └─────────────────────┘
```

---

## 🧠 Matching Engine

The matching engine is implemented as a dedicated service under:

```text
src/services/matchingEngine.ts
```

The engine evaluates candidate workers using matching and ranking signals.

Conceptually:

```text
Service Request
      │
      ▼
Filter compatible workers
      │
      ├── Category / service match
      ├── Locality / pincode match
      ├── Availability
      ├── Rating
      └── Fairness / rotation
      │
      ▼
Calculate candidate score
      │
      ▼
Rank workers
      │
      ▼
Return best matches
```

This separates matching logic from the UI and makes the algorithm easier to maintain and improve.

---

## 📁 Project Structure

A simplified structure of the repository:

```text
sevamitra/
│
├── database/
│   └── Database-related files
│
├── public/
│   └── Static public assets
│
├── src/
│   ├── services/
│   │   ├── matchingEngine.ts
│   │   └── Other service integrations
│   │
│   ├── components/
│   │   └── Reusable UI components
│   │
│   └── Application source files
│
├── .env.example
├── .gitignore
├── bun.lock
├── components.json
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/idkemail060-sys/sevamitra.git
cd sevamitra
```

### 2. Install dependencies

Using Bun:

```bash
bun install
```

Or using npm:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root based on `.env.example`.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=your_razorpay_key
APP_URL=http://localhost:3000
```

> Do not commit real API keys or private credentials to GitHub.

### 4. Start the development server

```bash
bun run dev
```

Or:

```bash
npm run dev
```

The Vite configuration starts the development server on port `3000`.

Open:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

From `package.json`:

| Command | Description |
|---|---|
| `bun run dev` | Start Vite development server |
| `bun run build` | Create production build |
| `bun run preview` | Preview production build |
| `bun run lint` | Run TypeScript type checking |
| `bun run clean` | Remove generated build/server files |

---

## 🔐 Environment Variables

The project uses environment configuration for external services.

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini / GenAI integration |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public client key |
| `RAZORPAY_KEY_ID` | Payment integration configuration |
| `APP_URL` | Application base URL |

### Security

Never commit:

```text
.env
.env.local
```

or any file containing private credentials.

For production deployments, configure environment variables through your hosting provider.

---

## 🗄️ Database

SevaMitra uses **Supabase** for backend/database functionality.

The repository also contains a `database/` directory for database-related resources.

A production deployment should ensure that:

- Row Level Security (RLS) is correctly configured.
- Users can only access data they are authorized to access.
- Administrative operations are protected.
- Service-role credentials are never exposed to the frontend.
- Sensitive personal information is minimized and protected.

---

## 💳 Payment Integration

The project contains Razorpay-related configuration for payment functionality.

For development and demonstrations, use the appropriate Razorpay test/sandbox environment and test credentials.

Before production use:

- Configure production payment credentials securely.
- Implement server-side payment verification.
- Validate payment signatures.
- Never trust payment status supplied only by the frontend.
- Keep private payment secrets on the server.

---

## 🤖 AI / Gemini

SevaMitra uses Google's GenAI SDK:

```text
@google/genai
```

AI functionality is designed to complement the platform's service discovery and user experience.

Potential applications include:

```text
User Query
    │
    ▼
Gemini / AI Layer
    │
    ├── Understand request
    ├── Identify service intent
    ├── Guide user
    └── Generate useful response
    │
    ▼
SevaMitra Service Flow
```

---

## 🚀 Deployment

The repository includes a Vite-based production build and is suitable for deployment on platforms such as Vercel.

### Build

```bash
npm run build
```

The generated production files are placed in the Vite `dist/` directory.

### Vercel

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables.
3. Use the Vite build configuration.
4. Deploy.
5. Verify Supabase and external API configuration.

### Live Demo

The repository currently references a deployed SevaMitra application:

**https://sevamitra.vercel.app/**

---

## 🧪 Testing & Validation

Before deployment, verify:

### Authentication
- [ ] User registration/login
- [ ] Correct role handling
- [ ] Logout/session behavior

### Household Flow
- [ ] Service selection
- [ ] Worker discovery
- [ ] Worker matching
- [ ] Request/booking flow

### Worker Flow
- [ ] Profile information
- [ ] Service categories
- [ ] Availability
- [ ] Incoming requests

### Matching
- [ ] Category matching
- [ ] Locality/pincode matching
- [ ] Rating-based ranking
- [ ] Availability handling
- [ ] Fairness/rotation behavior

### Payments
- [ ] Test payment flow
- [ ] Payment verification
- [ ] Error handling

### AI
- [ ] Gemini API configuration
- [ ] AI response handling
- [ ] API failure handling

---

## 📈 Future Enhancements

Potential improvements for future versions include:

- 📍 Real-time location and distance-based matching
- 🔔 Push notifications
- 💬 In-app household-worker chat
- 📞 Masked calling
- ⭐ Verified reviews and ratings
- 🪪 Worker identity/skill verification
- 📊 Advanced admin analytics
- 📱 Progressive Web App / mobile application
- 🧠 More advanced ML-based matching
- 🌐 Multi-language support
- 💳 Complete production-grade payment verification
- 🛡️ Stronger fraud and abuse prevention
- 📍 Live service tracking
- 📅 Advanced scheduling and recurring services

---

## 🎯 Project Impact

SevaMitra is designed around three major goals:

### For Households
**Find the right worker faster.**

### For Workers
**Get more relevant service opportunities.**

### For the Platform
**Create a transparent, scalable and fair service ecosystem.**

The combination of structured worker data, intelligent matching and AI-assisted interaction provides a foundation for a scalable local-services platform.

---

## 🏆 Hackathon Use Case

SevaMitra can be presented as a technology-driven solution for improving access to trusted local services.

### Problem

Traditional local service discovery often depends on:

- Word-of-mouth recommendations
- Unstructured contacts
- Limited worker visibility
- Unclear pricing
- Difficulty comparing workers
- Uneven distribution of opportunities

### Proposed Solution

SevaMitra provides:

```text
Household
    ↓
Service Requirement
    ↓
Smart Matching
    ↓
Suitable Workers
    ↓
Selection / Request
    ↓
Transparent Transaction
    ↓
Service Completion
    ↓
Rating & Feedback
```

---

## 🔒 Security Considerations

Security should be treated as a core part of the platform.

Recommended production practices:

- Use HTTPS everywhere.
- Enable and test Supabase RLS policies.
- Never expose service-role keys in frontend code.
- Keep payment secrets server-side.
- Validate all user-controlled input.
- Verify payment transactions on the backend.
- Apply authentication and authorization checks.
- Avoid storing unnecessary sensitive documents.
- Rotate compromised credentials immediately.
- Configure production environment variables through the deployment platform.

---

## 🤝 Contributing

Contributions are welcome.

### Workflow

```bash
# Fork the repository

# Clone your fork
git clone <your-fork-url>

# Create a branch
git checkout -b feature/your-feature

# Make changes

# Commit
git commit -m "Add: your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request.

---

## 📄 License

This project currently does not specify a license in the repository.

If you intend to make SevaMitra open source, add an appropriate `LICENSE` file before publishing it as an open-source project.

---

## 👨‍💻 Author

**Pranay Goswami**

Computer Science & Engineering

Built as a technology project focused on improving local service discovery through smart matching, AI and modern web technologies.

---

## ⭐ Support the Project

If you find SevaMitra interesting:

- ⭐ Star the repository
- 🍴 Fork the project
- 🐛 Report issues
- 💡 Suggest improvements
- 🤝 Contribute to the project

---

## 🔗 Links

- **GitHub:** https://github.com/idkemail060-sys/sevamitra
- **Live Demo:** https://sevamitra.vercel.app/

---

<p align="center">
  <b>SevaMitra — Connecting people with the right local service, smarter.</b>
</p>
