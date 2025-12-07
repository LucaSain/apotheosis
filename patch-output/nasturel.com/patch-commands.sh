
# ============================================
# Repository: nasturel.com
# ============================================

# 1. Clone repository (if not already cloned)
# git clone https://github.com/LucaSain/nasturel.com.git
# cd nasturel.com

# 2. Create and checkout feature branch
git checkout -b security/patch-nextjs-cve-2025-66478

# 3. Update Next.js to patch version
npm install next@14.2.33

# 4. Regenerate lockfile
npm install

# 5. Test the build
npm run build

# 6. Test development server
# npm run dev
# (Verify in browser, then Ctrl+C)

# 7. Commit changes
git add package.json package-lock.json
git commit -m "[Security] Patch Next.js CVE-2025-66478

Updated Next.js from 14.2.4 to 14.2.33
to address CVE-2025-66478.

- Updated Next.js dependency
- Regenerated package-lock.json
- Verified build passes

Security advisory: https://nextjs.org/blog/CVE-2025-66478"

# 8. Push branch
git push origin security/patch-nextjs-cve-2025-66478

# 9. Create Pull Request
# Use GitHub CLI or web interface:
# gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file pr-body.md

# 10. Create Follow-up Issue
# gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file issue-body.md
