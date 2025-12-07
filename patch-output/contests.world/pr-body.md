## Security Patch: CVE-2025-66478

### Summary
This PR addresses security vulnerability CVE-2025-66478 by updating Next.js from version ^14.0.1 to 14.2.33.

### Changes
- ✅ Updated Next.js to 14.2.33 (latest patch in 14.x series)
- ✅ Regenerated package-lock.json
- ✅ Verified build passes
- ✅ Tested application functionality

### Security Impact
This update patches CVE-2025-66478. For more details, see: https://nextjs.org/blog/CVE-2025-66478

### Testing
- `npm install` completes successfully
- `npm run build` completes without errors
- `npm run dev` starts development server correctly

### Next Steps
A follow-up issue has been created to track the major version upgrade to Next.js 16.0.7.

### References
- Advisory: https://nextjs.org/blog/CVE-2025-66478
- Next.js 14.2.33 Release Notes: https://github.com/vercel/next.js/releases/tag/v14.2.33

---
**Security Priority**: High
**Scope**: Patch within current major version
**Follow-up**: Issue #[NUMBER] - Upgrade to Next.js 16.0.7