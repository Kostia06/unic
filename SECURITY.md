# 🔒 UNIC México - Security Documentation

## Overview
This document outlines the security measures implemented in the UNIC México admin system and provides guidelines for maintaining security.

## Security Features Implemented

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based auth with 2-hour expiration
- **Strong Password Requirements**: Minimum 12 characters with complexity requirements
- **Account Lockout**: Automatic lockout after 5 failed login attempts (15-minute duration)
- **Session Management**: Automatic timeout and secure cookie handling
- **Role-based Access**: Admin role verification on all protected endpoints

### 🛡️ API Security
- **Authentication Middleware**: All admin endpoints require valid JWT tokens
- **Rate Limiting**: Multi-tier protection against abuse
  - Login attempts: 5 per 15 minutes
  - API calls: 100 per 15 minutes
  - File uploads: 10 per 15 minutes
  - CRUD operations: 20-30 per 15 minutes
- **Input Validation**: Comprehensive validation using regex patterns
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM

### 📁 File Upload Security
- **File Type Validation**: Magic byte checking prevents file type spoofing
- **Size Limits**: Maximum 5MB per file
- **Secure Naming**: Cryptographically secure random filenames
- **Directory Traversal Prevention**: Path validation and sanitization
- **Allowed Types**: Only JPEG, PNG, WEBP images permitted

### 🔍 Input Validation & Sanitization
- **XSS Prevention**: HTML entity encoding and dangerous character removal
- **Data Sanitization**: String trimming, length limits, null byte removal
- **Validation Patterns**: Email, password, product name, price validation
- **Array Validation**: Proper validation for complex data types

### 🚨 Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy`: Restrictive policy to prevent XSS
- `Strict-Transport-Security`: HTTPS enforcement in production
- `Referrer-Policy`: Strict origin policy

## Environment Variables

### Required Variables
```bash
# Strong JWT secret (64+ characters)
JWT_SECRET=your_secure_jwt_secret_here

# Database connections
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Security Configuration
```bash
# Environment
NODE_ENV=production

# Security settings
SECURE_COOKIES=true
HTTPS_ONLY=true
CSRF_PROTECTION=true

# Rate limiting
RATE_LIMIT_ENABLED=true
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000

# File upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
```

## Security Best Practices

### 🔑 Password Security
- **Minimum Requirements**: 12 characters, uppercase, lowercase, numbers, special characters
- **Hashing**: bcrypt with cost factor 12
- **No Storage**: Passwords are never stored in plain text
- **Regular Updates**: Change passwords every 90 days

### 🌐 HTTPS & Certificates
- **Always Use HTTPS**: Required in production for secure cookies
- **Certificate Validation**: Use valid SSL/TLS certificates
- **HSTS Headers**: Enforce HTTPS with Strict-Transport-Security
- **Secure Redirects**: Redirect HTTP to HTTPS automatically

### 🔐 JWT Token Management
- **Short Expiration**: 2-hour token lifetime
- **Secure Storage**: HttpOnly cookies preferred over localStorage
- **Token Rotation**: Implement refresh token mechanism for production
- **Revocation**: Implement token blacklist for immediate logout

### 📊 Monitoring & Logging
- **Failed Logins**: Log all failed authentication attempts
- **Admin Actions**: Log all CRUD operations with user ID and timestamp
- **Rate Limiting**: Log rate limit violations
- **Security Events**: Monitor suspicious activities

### 🚫 What NOT to Do
- ❌ Never commit `.env` files
- ❌ Don't use weak JWT secrets
- ❌ Never store passwords in plain text
- ❌ Don't disable security headers
- ❌ Avoid using default credentials
- ❌ Don't expose sensitive data in client-side code

## File Structure Security

### Protected Files (Not in Git)
```
.env                    # Environment variables
.env.local             # Local environment overrides
/public/uploads/*      # Uploaded files
/src/generated/        # Generated Prisma client
node_modules/          # Dependencies
*.log                  # Log files
*.backup              # Backup files
```

### Version Controlled Files
```
.env.example          # Environment template
src/lib/security.js   # Security utilities
src/lib/auth-middleware.js  # Authentication middleware
SECURITY.md           # This documentation
.gitignore           # Git ignore rules
```

## Production Deployment Checklist

### Before Deployment
- [ ] Generate strong JWT secret (64+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (`HTTPS_ONLY=true`)
- [ ] Set secure cookies (`SECURE_COOKIES=true`)
- [ ] Review and update environment variables
- [ ] Test all security features
- [ ] Run security audit script

### Server Configuration
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS certificates
- [ ] Enable security headers at server level
- [ ] Configure rate limiting at reverse proxy
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Database backup strategy

### Ongoing Maintenance
- [ ] Regular password updates
- [ ] Monitor security logs
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Review access logs
- [ ] Test backup and recovery procedures

## Incident Response

### If Security Breach Suspected
1. **Immediate Action**: Disable affected accounts
2. **Investigate**: Review logs for suspicious activity
3. **Contain**: Block malicious IP addresses
4. **Assess**: Determine scope of potential breach
5. **Recover**: Reset credentials and update security measures
6. **Review**: Analyze incident and improve security

### Emergency Contacts
- System Administrator: [Your contact]
- Security Team: [Your security team]
- Database Administrator: [Your DBA]

## Security Testing

### Regular Tests
- Authentication bypass attempts
- SQL injection testing
- XSS vulnerability scanning
- File upload security testing
- Rate limiting verification
- Session management testing

### Tools for Testing
- OWASP ZAP for vulnerability scanning
- Burp Suite for manual testing
- npm audit for dependency vulnerabilities
- Custom security test scripts

## Contact

For security concerns or questions, please contact:
- Email: [your-security-email]
- Secure Channel: [encrypted communication method]

---

**Remember**: Security is an ongoing process, not a one-time setup. Regular reviews and updates are essential for maintaining a secure system.