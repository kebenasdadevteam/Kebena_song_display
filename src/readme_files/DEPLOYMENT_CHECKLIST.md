# Deployment Checklist - Kebena Church Song Display

Use this checklist to ensure proper deployment and setup.

## 📦 Pre-Deployment

### System Requirements
- [ ] Node.js 14.x or higher installed
- [ ] MySQL 5.7 or higher installed
- [ ] Git installed (for version control)
- [ ] Minimum 2GB RAM available
- [ ] At least 500MB free disk space

### Files Verification
- [ ] All project files extracted
- [ ] `kebena_backend/` folder exists
- [ ] `components/` folder exists
- [ ] `package.json` exists in root
- [ ] `kebena_backend/package.json` exists

## 🔧 Initial Setup

### Backend Setup
- [ ] Navigate to `kebena_backend/`
- [ ] Run `npm install`
- [ ] Verify `.env` file exists
- [ ] Update MySQL password in `.env`
- [ ] Check `uploads/` folder exists (create if missing)
- [ ] Run `npm run init-db` to initialize database

### Frontend Setup
- [ ] Navigate to project root
- [ ] Run `npm install`
- [ ] Verify `services/api.ts` has correct API URL
- [ ] Check all components are present

### Database Setup
- [ ] MySQL service is running
- [ ] Database `kebena_church_db` created
- [ ] Tables created successfully
- [ ] Default admin user exists
- [ ] Test login: username `admin`, password `admin123`

## ✅ Testing

### Backend Tests
- [ ] Backend starts without errors (`npm start` in `kebena_backend/`)
- [ ] Can access http://localhost:5000
- [ ] Health check works: http://localhost:5000/health
- [ ] API root returns JSON: http://localhost:5000/api
- [ ] No CORS errors in console

### Frontend Tests
- [ ] Frontend starts (`npm run dev` in root)
- [ ] Can access http://localhost:5173
- [ ] Login screen appears
- [ ] Can login with admin credentials
- [ ] Hymnal section displays
- [ ] Local Songs section displays

### Feature Tests
- [ ] Can add song manually
- [ ] Can upload PPTX file
- [ ] Can upload PDF file
- [ ] File processing works
- [ ] Can edit song
- [ ] Can delete song
- [ ] Can open Admin Panel
- [ ] Presentation mode works (Monitor button)
- [ ] Auto-detect files works (scan uploads folder)

### File Upload Tests
- [ ] `uploads/` folder has write permissions
- [ ] Can select file to upload
- [ ] File uploads successfully
- [ ] Slides extracted correctly
- [ ] Can edit extracted slides
- [ ] Song saves with uploaded file metadata

## 🔐 Security

### Password Security
- [ ] Changed default admin password
- [ ] Admin password is strong (8+ chars, mixed case, numbers)
- [ ] Database password is set
- [ ] JWT_SECRET changed from default

### File Security
- [ ] Uploads folder permissions set correctly
- [ ] File size limit appropriate (10MB default)
- [ ] Only PDF/PPTX files accepted
- [ ] File validation working

### Access Control
- [ ] Admin users can access Admin Panel
- [ ] Regular users cannot access Admin Panel
- [ ] JWT authentication working
- [ ] Session expires correctly (7 days default)

## 🌐 Production Deployment

### Environment Configuration
- [ ] `.env` file updated for production
- [ ] `NODE_ENV=production` set
- [ ] Strong `JWT_SECRET` configured
- [ ] `FRONTEND_URL` points to production domain
- [ ] Database credentials secured

### Build Process
- [ ] Frontend build created: `npm run build`
- [ ] Build directory exists: `dist/`
- [ ] Static files served correctly
- [ ] No console errors in production build

### Server Setup
- [ ] Backend runs in production mode
- [ ] Process manager installed (PM2 recommended)
- [ ] Auto-restart on crash configured
- [ ] Logs being collected
- [ ] HTTPS/SSL configured (if applicable)

### Database
- [ ] Production database created
- [ ] Database backed up
- [ ] Backup schedule configured
- [ ] Database permissions set correctly

## 🚀 Launch

### Pre-Launch
- [ ] All tests passing
- [ ] Sample songs added
- [ ] Admin password changed
- [ ] User documentation ready
- [ ] Backup plan in place

### Launch Day
- [ ] Start backend server
- [ ] Start frontend
- [ ] Monitor logs for errors
- [ ] Test all critical features
- [ ] Verify projector/presentation mode works

### Post-Launch
- [ ] Monitor server performance
- [ ] Check error logs daily
- [ ] Verify backups running
- [ ] Collect user feedback
- [ ] Plan for updates/improvements

## 📊 Monitoring

### Daily Checks
- [ ] Server is running
- [ ] Database is accessible
- [ ] No critical errors in logs
- [ ] Disk space sufficient
- [ ] Backups completed

### Weekly Checks
- [ ] Review error logs
- [ ] Check song database growth
- [ ] Verify backup integrity
- [ ] Update dependencies if needed
- [ ] Clean old uploaded files

## 🐛 Troubleshooting Ready

### Common Issues Documented
- [ ] Port conflicts solution ready
- [ ] Database connection errors documented
- [ ] File upload issues covered
- [ ] CORS errors explained
- [ ] Permission issues addressed

### Support Ready
- [ ] Admin contact information updated
- [ ] Troubleshooting guide accessible
- [ ] Quick reference guide available
- [ ] User training completed

## 📝 Documentation

### User Documentation
- [ ] README.md reviewed
- [ ] COMPLETE_SETUP_GUIDE.md available
- [ ] NEW_FEATURES_IMPLEMENTED.md present
- [ ] ADMIN_QUICK_REFERENCE.md ready
- [ ] TROUBLESHOOTING.md complete

### Technical Documentation
- [ ] API endpoints documented
- [ ] Database schema documented
- [ ] Environment variables documented
- [ ] Deployment process documented

## 🎯 Final Verification

### Functionality
- [ ] Can browse songs
- [ ] Can search songs
- [ ] Can view song in presentation mode
- [ ] Can open projector window
- [ ] Projector window syncs with main window
- [ ] Can add songs (all 3 methods)
- [ ] Can edit songs
- [ ] Can delete songs
- [ ] Background customization works

### Performance
- [ ] Page loads quickly (<3 seconds)
- [ ] Song search is responsive
- [ ] File upload completes reasonably
- [ ] No memory leaks observed
- [ ] Database queries efficient

### User Experience
- [ ] Interface is intuitive
- [ ] Error messages are helpful
- [ ] Success notifications work
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive (if needed)

## ✨ Optional Enhancements

### Nice to Have
- [ ] Custom church logo uploaded
- [ ] Church color scheme customized
- [ ] Sample songs imported
- [ ] User accounts created
- [ ] Email notifications configured

### Future Improvements
- [ ] More background themes added
- [ ] Playlist feature
- [ ] Song categories/tags
- [ ] Advanced search filters
- [ ] Song usage statistics
- [ ] Export/import functionality

## 📞 Emergency Contacts

### Technical Support
- Primary Contact: ____________________
- Phone: ____________________
- Email: ____________________

### Server Administrator
- Name: ____________________
- Phone: ____________________
- Email: ____________________

### Database Administrator
- Name: ____________________
- Phone: ____________________
- Email: ____________________

## 🎉 Deployment Complete!

Once all items are checked:
- [ ] Deployment is COMPLETE
- [ ] System is PRODUCTION READY
- [ ] Team is TRAINED
- [ ] Documentation is AVAILABLE
- [ ] Support is READY

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________  
**Notes:** 
_______________________________________________
_______________________________________________
_______________________________________________

**System is ready for worship service! 🙌**
