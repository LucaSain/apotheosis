# Next.js Security Patch - CVE-2025-66478

## Overview
This directory contains automated patch instructions for remediating CVE-2025-66478 across LucaSain's repositories.

## Summary
- **Total Repositories**: 8
- **Requires Patching**: 8
- **Already Up-to-date**: 0
- **Scan Date**: 2025-12-06T21:52:54.297Z

## Repository-Specific Instructions
Each subdirectory contains:
- `pr-body.md` - Pull Request description template
- `issue-body.md` - Follow-up issue template for major version upgrade
- `patch-commands.sh` - Shell commands to execute the patch
- `patch-data.json` - Structured data about the patch

## Repositories Requiring Patches
1. **apotheosis**: 13.1.2 → 13.5.11
2. **Spectra-Design**: 15.4.2 → 15.5.7
3. **contests.world**: ^14.0.1 → 14.2.33
4. **portfolio**: 14.2.5 → 14.2.33
5. **nasturel.com**: 14.2.4 → 14.2.33
6. **tabere.nasturel.com**: 14.2.5 → 14.2.33
7. **petreceri-pentru-copii-sibiu**: 14.2.5 → 14.2.33
8. **portfolio-vavilov**: 14.2.5 → 14.2.33

## Execution Instructions

### For Each Repository:
1. Navigate to the repository directory: `cd <repository-name>`
2. Review the patch data: `cat patch-data.json`
3. Execute the patch: `bash patch-commands.sh`
4. Create PR using: `gh pr create --title "..." --body-file pr-body.md`
5. Create follow-up issue: `gh issue create --title "..." --body-file issue-body.md`

### Prerequisites
- Git configured with push access to repositories
- Node.js and npm installed
- GitHub CLI (gh) installed and authenticated

## Advisory Reference
https://nextjs.org/blog/CVE-2025-66478

## Notes
- All patches stay within the current major version
- Follow-up issues track future major version upgrades
- Test builds before pushing changes
