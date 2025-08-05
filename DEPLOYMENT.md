# 🚀 UNIC México - Vercel Deployment Guide

## Quick Setup

### **Vercel Dashboard Settings**

**Framework Preset:** Next.js

**Build Settings:**
- **Build Command:** `npm run build`
- **Install Command:** `npm install && npx prisma generate`  
- **Output Directory:** `.next`
- **Root Directory:** `./`

### **Environment Variables**

Add these in Vercel Dashboard → Settings → Environment Variables:

#### **🔒 Security (CRITICAL)**
```bash
JWT_SECRET=fd84b9ac245d6139ff11ec61dfaf86fca97af63ac7162b8556409307517cbb994f02556320ad82cf06d906e19a416cfb32417143cf7723baf014f990273ca146
NODE_ENV=production
SECURE_COOKIES=true
HTTPS_ONLY=true
```

#### **🗄️ Database**
```bash
DATABASE_URL=your_supabase_database_url_with_pgbouncer_true
DIRECT_URL=your_supabase_direct_connection_url_port_5432
```

#### **🔗 Supabase**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **🌐 Site Configuration**
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

#### **⚡ Rate Limiting**
```bash
RATE_LIMIT_ENABLED=true
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000
```

#### **📁 File Upload**
```bash
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
UPLOAD_RATE_LIMIT=10
```

## Step-by-Step Deployment

### **1. Push to GitHub** (if not done yet)
```bash
git add .
git commit -m "feat: Add Vercel configuration"
git push origin main
```

### **2. Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `Kostia06/unic`
4. Configure settings as above
5. Deploy!

### **3. After First Deployment**

#### **Set up Database:**
```bash
# In Vercel dashboard, go to Functions tab and run:
npx prisma db push
```

#### **Create Admin Account:**
You'll need to create an admin account manually since the setup script runs locally. Use this SQL in your Supabase dashboard:

```sql
-- Insert admin user (password: Admin123!)
INSERT INTO admin_users (email, password, name, role, is_active) 
VALUES (
  'admin@unic.com', 
  '$2a$12$LQv3c1yqBwEHxv03kHQNOeahd93wuwckqhYXYfxvjdBJA.cxvd/O.', 
  'Admin User', 
  'admin', 
  true
);
```

### **4. Verify Deployment**

**Test these URLs:**
- ✅ **Homepage:** `https://your-domain.vercel.app`
- ✅ **Admin Login:** `https://your-domain.vercel.app/admin`
- ✅ **API Health:** `https://your-domain.vercel.app/api/admin/products`

**Admin Credentials:**
- Email: `admin@unic.com`
- Password: `Admin123!`

### **5. Post-Deployment Security**

#### **Change Default Admin Password:**
1. Login to admin panel
2. Go to admin settings (when implemented)
3. Change to a strong password

#### **Monitor Security:**
- Check Vercel function logs
- Monitor failed login attempts
- Review security headers

## 🔧 Troubleshooting

### **Common Issues:**

#### **Database Connection Error:**
```bash
# Ensure DATABASE_URL has ?pgbouncer=true
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
```

#### **Prisma Generate Error:**
```bash
# Check that install command includes:
npm install && npx prisma generate
```

#### **JWT Secret Error:**
```bash
# Ensure JWT_SECRET is set in environment variables
# Should be 64+ characters long
```

#### **File Upload Not Working:**
```bash
# Check environment variables:
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
```

### **Environment Variable Checklist:**
- [ ] JWT_SECRET (64+ characters)
- [ ] DATABASE_URL (with pgbouncer=true)
- [ ] DIRECT_URL (port 5432)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_SITE_URL
- [ ] NODE_ENV=production
- [ ] SECURE_COOKIES=true
- [ ] HTTPS_ONLY=true

## 📊 Performance Optimization

### **Vercel Function Regions:**
Set region closest to your users in `vercel.json`:
- `iad1` - US East
- `sfo1` - US West  
- `fra1` - Europe
- `hnd1` - Asia

### **Caching Strategy:**
- Static assets: Cached automatically
- API routes: Custom caching in middleware
- Database queries: Prisma connection pooling

## 🔒 Security Checklist

After deployment, verify:
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers present
- [ ] Admin login requires authentication
- [ ] File uploads restricted to images
- [ ] Rate limiting working
- [ ] Environment variables secure
- [ ] No sensitive data in client bundle

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Review Supabase logs
3. Verify environment variables
4. Test locally first

---

**🎉 Your UNIC México jewelry e-commerce platform is now live and secure!**