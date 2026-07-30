# 🚀 Quick Start Guide - Intern 2 Expert

## Get Up and Running in 5 Minutes

### Prerequisites
- Node.js 16+ and npm
- PHP 8.1+ and Composer
- MySQL 5.7+
- Git (optional)

---

## Part 1: Backend Setup (2 minutes)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
composer install
```

### Step 3: Create Environment File
```bash
cp .env.example .env
```

### Step 4: Configure Database
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intern2expert
DB_USERNAME=root
DB_PASSWORD=
```

### Step 5: Generate App Key
```bash
php artisan key:generate
```

### Step 6: Run Migrations
```bash
php artisan migrate
```

### Step 7: Configure Email (Optional but Recommended)
Edit `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_TO_ADDRESS=admin@intern2expert.com
```

### Step 8: Start Backend Server
```bash
php artisan serve
```
Server will run at: `http://127.0.0.1:8000`

---

## Part 2: Frontend Setup (2 minutes)

### Step 1: Open New Terminal/Tab

### Step 2: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure API URL
Edit `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  apiUrl: 'http://127.0.0.1:8000/api'
};
```

### Step 5: Start Development Server
```bash
ng serve
```
or
```bash
npm start
```

Application will open at: `http://localhost:4200`

---

## Part 3: Testing (1 minute)

### Test Homepage
1. Open `http://localhost:4200`
2. You should see:
   - ✅ Hero section with image carousel
   - ✅ Programs section (2 cards)
   - ✅ About section
   - ✅ Benefits section
   - ✅ Training section
   - ✅ Statistics (animated counters)
   - ✅ Partner colleges (cards)
   - ✅ CTA section
   - ✅ AI Chatbot (bottom-right corner)

### Test Application Form
1. Click "Apply Now" button
2. You should see:
   - ✅ Form fields (Personal, Academic, Internship, Documents)
   - ✅ File upload (PDF/DOC/DOCX)
   - ✅ Submit button
3. Fill out form and submit
4. ✅ Success message should appear

### Test Chatbot
1. Click floating button (bottom-right)
2. Chat opens
3. Type: "internship programs"
4. Bot responds with information
5. Type: "eligibility", "fees", "duration", etc.

### Test Certificate Generator
1. Navigate to `http://localhost:4200/certificate-generator`
2. Fill out form:
   - Student name
   - Email
   - Select program
   - Choose date
   - Select duration
   - Enter score (0-100)
3. Click "Generate Certificate"
4. ✅ Preview shows
5. Click "Download Certificate"
6. ✅ PNG file downloads

### Test SEO Files
1. Visit: `http://localhost:4200/robots.txt`
2. ✅ robots.txt content visible
3. Visit: `http://localhost:4200/sitemap.xml`
4. ✅ sitemap.xml content visible

---

## Common Commands

### Frontend Commands
```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Backend Commands
```bash
# Start server
php artisan serve

# Run migrations
php artisan migrate

# Clear cache
php artisan optimize:clear

# Tinker (interactive shell)
php artisan tinker
```

---

## Troubleshooting

### Issue: "Port 4200 already in use"
```bash
# Use different port
ng serve --port 4300
```

### Issue: "Port 8000 already in use"
```bash
# Use different port
php artisan serve --port 8001
```

### Issue: "Database connection failed"
```bash
# Check .env DB credentials
# Create database if not exists
# Run migrations: php artisan migrate
```

### Issue: "CORS error"
Backend should have CORS enabled. Check:
```php
// config/cors.php - should allow your frontend URL
```

### Issue: "Module not found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Email not sending"
```
Check .env MAIL settings
Gmail: Enable "App passwords" and use app password
Make sure MAIL_TO_ADDRESS is set
```

---

## File Structure Overview

```
intern2expert/
├── frontend/                    # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/          # Route pages
│   │   │   ├── shared/         # Reusable components
│   │   │   └── app.routes.ts   # Routes
│   │   ├── index.html          # Main HTML (SEO meta tags)
│   │   └── styles.css          # Global styles
│   ├── angular.json            # Angular config
│   └── package.json            # Dependencies
│
├── backend/                     # Laravel app
│   ├── app/
│   │   ├── Http/               # Controllers & Requests
│   │   ├── Models/             # Data models
│   │   └── Mail/               # Email classes
│   ├── routes/
│   │   ├── api.php            # API routes
│   │   └── web.php            # Web routes
│   ├── database/              # Migrations & seeders
│   ├── .env                   # Configuration
│   └── composer.json          # Dependencies
│
└── public/                     # Static files
    ├── robots.txt            # SEO
    └── sitemap.xml           # SEO
```

---

## Feature Quick Reference

| Feature | Route | Status |
|---------|-------|--------|
| Home | / | ✅ Active |
| Programs | /internship-programs | ✅ Active |
| Apply Form | /apply | ✅ Active |
| Certificate Gen | /certificate-generator | ✅ Active |

| Terms | /terms | ✅ Active |

---

## Next Steps

1. **Customize Content**
   - Update college names in partner colleges
   - Modify statistics numbers
   - Add more chatbot Q&A pairs

2. **Configure Email**
   - Set up Gmail App Password
   - Test form submissions

3. **Deploy**
   - Build frontend: `npm run build`
   - Deploy to hosting
   - Configure production domain

4. **Monitor**
   - Check browser console for errors
   - Monitor email sending
   - Track statistics

---

## Useful Resources

### Documentation
- [FEATURE_ENHANCEMENT_SUMMARY.md](./FEATURE_ENHANCEMENT_SUMMARY.md) - Full feature overview
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Detailed implementation guide
- [CHANGE_MANIFEST.md](./CHANGE_MANIFEST.md) - Complete list of changes

### Official Docs
- Angular: https://angular.io/docs
- Laravel: https://laravel.com/docs
- TypeScript: https://www.typescriptlang.org

---

## Support

### For Issues:
1. Check browser console (F12)
2. Check Laravel logs: `backend/storage/logs/laravel.log`
3. Review CHANGE_MANIFEST.md for details
4. Verify environment variables in .env

### Email Support:
Add your support email here

---

## Development Tips

### Enable Debug Mode
Frontend:
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api'
};
```

Backend:
```env
APP_DEBUG=true
APP_ENV=local
```

### Use DevTools
- Chrome DevTools (F12)
- View console errors
- Check network requests
- Test responsive design

### Performance Testing
```bash
# Frontend Lighthouse audit
# DevTools > Lighthouse

# Backend performance
# Laravel Debugbar or Telescope
```

---

## Success Checklist

After following these steps, verify:

- [ ] Frontend running at http://localhost:4200
- [ ] Backend running at http://localhost:8000
- [ ] Homepage loads with all sections
- [ ] Chatbot appears (bottom-right)
- [ ] Application form works
- [ ] File upload accepts multiple formats
- [ ] Certificate generator accessible
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Email notifications configured

---

## You're All Set! 🎉

Your Intern 2 Expert platform is now running with:
- ✅ 9 new features
- ✅ Enhanced UI/UX
- ✅ SEO optimization
- ✅ AI chatbot
- ✅ Certificate generator
- ✅ Responsive design
- ✅ Production ready

**Happy coding!** 🚀

---

## Quick Command Reference

```bash
# Start everything (2 terminals)

# Terminal 1: Backend
cd backend
php artisan serve

# Terminal 2: Frontend
cd frontend
npm start

# Visit: http://localhost:4200
```

---

**For detailed information, refer to IMPLEMENTATION_GUIDE.md**
