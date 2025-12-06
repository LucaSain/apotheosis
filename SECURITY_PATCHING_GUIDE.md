# Next.js Security Patching Guide - CVE-2025-66478

## Executive Summary

This repository contains a comprehensive solution for patching CVE-2025-66478 across all Next.js repositories in the LucaSain GitHub account. The automation script has identified **8 repositories** using Next.js, all requiring security patches.

## Repository Analysis Results

### Current Status
- ✅ **apotheosis** - PATCHED (13.1.2 → 13.5.11) - **This PR**
- ⏳ **Spectra-Design** - Requires patch (15.4.2 → 15.5.7)
- ⏳ **contests.world** - Requires patch (^14.0.1 → 14.2.33)
- ⏳ **portfolio** - Requires patch (14.2.5 → 14.2.33)
- ⏳ **nasturel.com** - Requires patch (14.2.4 → 14.2.33)
- ⏳ **tabere.nasturel.com** - Requires patch (14.2.5 → 14.2.33)
- ⏳ **petreceri-pentru-copii-sibiu** - Requires patch (14.2.5 → 14.2.33)
- ⏳ **portfolio-vavilov** - Requires patch (14.2.5 → 14.2.33)

## What This PR Delivers

### 1. Security Patch for apotheosis
- Updated Next.js from **13.1.2** to **13.5.11**
- Regenerated package-lock.json with updated dependencies
- Verified Next.js installation (v13.5.11 confirmed)

### 2. Automation Script
**File**: `patch-nextjs-security.js`

A comprehensive Node.js script that:
- Scans GitHub repositories for Next.js usage
- Identifies vulnerable versions
- Determines appropriate patch versions within current major versions
- Generates PR templates and issue templates
- Creates executable shell scripts for patching

**Usage**:
```bash
node patch-nextjs-security.js
```

### 3. Patch Instructions for All Repositories
**Directory**: `patch-output/`

Contains complete patching instructions for each repository:

```
patch-output/
├── README.md                    # Master guide
├── summary.json                 # JSON summary of all repositories
├── apotheosis/                  # Patch files for apotheosis
├── Spectra-Design/             # Patch files for Spectra-Design
├── contests.world/             # Patch files for contests.world
├── portfolio/                   # Patch files for portfolio
├── nasturel.com/               # Patch files for nasturel.com
├── tabere.nasturel.com/        # Patch files for tabere.nasturel.com
├── petreceri-pentru-copii-sibiu/ # Patch files for petreceri-pentru-copii-sibiu
└── portfolio-vavilov/          # Patch files for portfolio-vavilov
```

Each repository directory contains:
- `pr-body.md` - Pull Request description template
- `issue-body.md` - Follow-up issue template for major version upgrade
- `patch-commands.sh` - Executable shell script to apply the patch
- `patch-data.json` - Structured data about the patch

## How to Patch the Remaining Repositories

### Prerequisites
- Git configured with push access to repositories
- Node.js and npm installed
- GitHub CLI (`gh`) installed and authenticated (optional but recommended)

### Step-by-Step Process

For each repository that needs patching, follow these steps:

#### 1. Clone the Repository (if not already cloned)
```bash
git clone https://github.com/LucaSain/<repository-name>.git
cd <repository-name>
```

#### 2. Create Feature Branch
```bash
git checkout -b security/patch-nextjs-cve-2025-66478
```

#### 3. Apply the Patch

**Option A: Using the generated shell script**
```bash
# Copy the patch commands from the apotheosis patch-output directory
# Execute the relevant commands (update Next.js, install, build, commit)
```

**Option B: Manual execution**
```bash
# Update Next.js to the target version (see patch-data.json for version)
npm install next@<target-version>

# Verify build
npm run build

# Commit changes
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to <target-version>"

# Push branch
git push origin security/patch-nextjs-cve-2025-66478
```

#### 4. Create Pull Request
```bash
# Using GitHub CLI
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" \
             --body-file ../apotheosis/patch-output/<repository-name>/pr-body.md

# Or manually through GitHub web interface
```

#### 5. Create Follow-up Issue for Major Version Upgrade
```bash
# Using GitHub CLI
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" \
                --body-file ../apotheosis/patch-output/<repository-name>/issue-body.md

# Or manually through GitHub web interface
```

## Target Versions by Major

The patches follow these version targets:

| Current Major | Patch Version | Future Major Upgrade |
|---------------|---------------|----------------------|
| Next.js 13.x  | 13.5.11       | 16.0.7              |
| Next.js 14.x  | 14.2.33       | 16.0.7              |
| Next.js 15.x  | 15.5.7        | 16.0.7              |

## Security Details

### CVE-2025-66478
- **Advisory**: https://nextjs.org/blog/CVE-2025-66478
- **Severity**: High
- **Impact**: [Details from advisory]
- **Mitigation**: Update to latest patch version within current major

### Why Patch Within Current Major?
1. **Minimal Breaking Changes**: Patch versions maintain backward compatibility
2. **Quick Deployment**: Can be deployed without extensive testing
3. **Immediate Security**: Addresses vulnerability immediately
4. **Reduced Risk**: Lower risk of introducing new bugs

### Why Follow-up with Major Upgrade?
1. **Long-term Security**: Latest major versions receive security updates longer
2. **Performance**: New features and optimizations
3. **Modern Features**: Access to latest React and Next.js capabilities
4. **Future-proofing**: Keeps codebase modern and maintainable

## Repository-Specific Notes

### apotheosis (13.1.2 → 13.5.11)
- ✅ **COMPLETED IN THIS PR**
- Requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables for build
- Uses React 18.2.0, Three.js, and DaisyUI

### Spectra-Design (15.4.2 → 15.5.7)
- Already on Next.js 15.x (latest major)
- Uses React 19.1.0
- Uses Tailwind CSS v4
- Minimal patch required

### contests.world (^14.0.1 → 14.2.33)
- Significant patch jump (14.0.1 → 14.2.33)
- Uses Next-Auth and Prisma
- Test authentication flows after patching

### portfolio (14.2.5 → 14.2.33)
- Uses MDX for content
- Uses Minio for storage
- Test MDX rendering after patch

### nasturel.com (14.2.4 → 14.2.33)
- Uses Firebase
- Uses Mailjet for emails
- Test email functionality

### tabere.nasturel.com (14.2.5 → 14.2.33)
- Uses Framer Motion
- Uses Mailjet for emails
- Test animations and email forms

### petreceri-pentru-copii-sibiu (14.2.5 → 14.2.33)
- Similar stack to tabere.nasturel.com
- Uses Framer Motion
- Test animations

### portfolio-vavilov (14.2.5 → 14.2.33)
- Similar to petreceri-pentru-copii-sibiu
- Uses Framer Motion
- Test animations

## Testing Checklist

For each repository after patching:

- [ ] `npm install` completes successfully
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts development server
- [ ] Navigate to key pages and verify functionality
- [ ] Test any API routes or server-side functionality
- [ ] Test authentication if applicable
- [ ] Verify environment variables are correctly configured
- [ ] Check console for errors

## Automation Script Details

The `patch-nextjs-security.js` script can be:
- **Re-run** to check status after patches are applied
- **Modified** to add new repositories
- **Extended** to automate PR/issue creation with proper GitHub tokens
- **Reused** for future CVE patching scenarios

## Timeline and Priority

### Immediate (Within 1-2 days)
1. ✅ apotheosis - DONE
2. portfolio - Active personal website
3. nasturel.com - Active festival website

### High Priority (Within 1 week)
4. contests.world - Active contest platform
5. tabere.nasturel.com - Active camps website
6. portfolio-vavilov - Client portfolio

### Medium Priority (Within 2 weeks)
7. Spectra-Design - Design system (already on v15)
8. petreceri-pentru-copii-sibiu - Events website

## Support and Questions

For questions about:
- **The CVE**: See advisory at https://nextjs.org/blog/CVE-2025-66478
- **Next.js Releases**: See https://github.com/vercel/next.js/releases
- **Migration Guides**: See https://nextjs.org/docs/upgrading
- **This Automation**: Review `patch-nextjs-security.js` source code

## Related Issues

After patching, follow-up issues will be created for:
- Major version upgrade to Next.js 16.0.7
- Testing and validation
- Performance monitoring post-upgrade

## Compliance and Audit Trail

All patches:
- Update only Next.js within current major version
- Regenerate package-lock.json to ensure dependency integrity
- Include comprehensive PR descriptions for audit trail
- Reference CVE-2025-66478 in commit messages
- Create follow-up issues for major version upgrades

## Success Metrics

- ✅ 1/8 repositories patched (12.5%)
- ⏳ 7/8 repositories pending (87.5%)
- 🎯 Goal: 100% patched within 2 weeks

---

**Last Updated**: 2025-12-06  
**CVE Reference**: CVE-2025-66478  
**Script Version**: 1.0  
**Generated By**: patch-nextjs-security.js
