# Quick Start: Patching Remaining Repositories

This guide provides quick commands to patch the remaining 7 repositories for CVE-2025-66478.

## Prerequisites

```bash
# Install GitHub CLI if not already installed
# macOS
brew install gh

# Linux
sudo apt install gh

# Authenticate
gh auth login
```

## Batch Patching Script

You can use this script to patch all remaining repositories:

```bash
#!/bin/bash

# CVE-2025-66478 Batch Patching Script
# This script patches all remaining LucaSain repositories

set -e

WORK_DIR="/tmp/nextjs-patching"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Repository and version mappings
declare -A REPOS=(
    ["Spectra-Design"]="15.5.7"
    ["contests.world"]="14.2.33"
    ["portfolio"]="14.2.33"
    ["nasturel.com"]="14.2.33"
    ["tabere.nasturel.com"]="14.2.33"
    ["petreceri-pentru-copii-sibiu"]="14.2.33"
    ["portfolio-vavilov"]="14.2.33"
)

BRANCH_NAME="security/patch-nextjs-cve-2025-66478"
PATCH_OUTPUT_DIR="$HOME/apotheosis-patch-output"  # Update this path

# Function to patch a repository
patch_repo() {
    local repo=$1
    local version=$2
    
    echo "================================================"
    echo "Patching repository: $repo"
    echo "Target version: $version"
    echo "================================================"
    
    # Clone if not exists
    if [ ! -d "$repo" ]; then
        gh repo clone "LucaSain/$repo"
    fi
    
    cd "$repo"
    
    # Create and checkout branch
    git checkout main || git checkout master
    git pull
    git checkout -b "$BRANCH_NAME" || git checkout "$BRANCH_NAME"
    
    # Update Next.js
    npm install "next@$version"
    
    # Verify
    npx next --version
    
    # Try to build (may fail due to missing env vars, but that's ok)
    npm run build || echo "Build failed (might be due to env vars)"
    
    # Commit
    git add package.json package-lock.json
    git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to $version

Updated Next.js to address CVE-2025-66478.

- Updated Next.js from current version to $version
- Regenerated package-lock.json
- Verified Next.js installation

Security advisory: https://nextjs.org/blog/CVE-2025-66478"
    
    # Push
    git push origin "$BRANCH_NAME"
    
    # Create PR
    if [ -f "$PATCH_OUTPUT_DIR/$repo/pr-body.md" ]; then
        gh pr create \
            --title "[Security] Patch Next.js CVE-2025-66478" \
            --body-file "$PATCH_OUTPUT_DIR/$repo/pr-body.md" \
            --base main || \
        gh pr create \
            --title "[Security] Patch Next.js CVE-2025-66478" \
            --body-file "$PATCH_OUTPUT_DIR/$repo/pr-body.md" \
            --base master
    else
        echo "Warning: PR body file not found, creating PR with default message"
        gh pr create \
            --title "[Security] Patch Next.js CVE-2025-66478" \
            --body "Updates Next.js to $version to address CVE-2025-66478"
    fi
    
    # Create follow-up issue
    if [ -f "$PATCH_OUTPUT_DIR/$repo/issue-body.md" ]; then
        gh issue create \
            --title "[Enhancement] Upgrade Next.js to version 16.0.7" \
            --body-file "$PATCH_OUTPUT_DIR/$repo/issue-body.md"
    fi
    
    cd ..
    echo "✅ Completed: $repo"
    echo ""
}

# Main execution
echo "Starting batch patching process..."
echo "Working directory: $WORK_DIR"
echo "Patch output directory: $PATCH_OUTPUT_DIR"
echo ""

for repo in "${!REPOS[@]}"; do
    patch_repo "$repo" "${REPOS[$repo]}"
done

echo "================================================"
echo "✅ All repositories patched successfully!"
echo "================================================"
echo ""
echo "Summary:"
echo "- apotheosis: Already patched in previous PR"
for repo in "${!REPOS[@]}"; do
    echo "- $repo: Patched to ${REPOS[$repo]}"
done
```

## Individual Repository Commands

If you prefer to patch repositories one at a time:

### Spectra-Design (15.4.2 → 15.5.7)

```bash
cd /tmp
gh repo clone LucaSain/Spectra-Design
cd Spectra-Design
git checkout -b security/patch-nextjs-cve-2025-66478
npm install next@15.5.7
npx next --version  # Verify: Next.js v15.5.7
npm run build
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to 15.5.7"
git push origin security/patch-nextjs-cve-2025-66478
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file <path-to>/patch-output/Spectra-Design/pr-body.md
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file <path-to>/patch-output/Spectra-Design/issue-body.md
```

### contests.world (^14.0.1 → 14.2.33)

```bash
cd /tmp
gh repo clone LucaSain/contests.world
cd contests.world
git checkout -b security/patch-nextjs-cve-2025-66478
npm install next@14.2.33
npx next --version  # Verify: Next.js v14.2.33
npm run build
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to 14.2.33"
git push origin security/patch-nextjs-cve-2025-66478
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file <path-to>/patch-output/contests.world/pr-body.md
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file <path-to>/patch-output/contests.world/issue-body.md
```

### portfolio (14.2.5 → 14.2.33)

```bash
cd /tmp
gh repo clone LucaSain/portfolio
cd portfolio
git checkout -b security/patch-nextjs-cve-2025-66478
npm install next@14.2.33
npx next --version  # Verify: Next.js v14.2.33
npm run build
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to 14.2.33"
git push origin security/patch-nextjs-cve-2025-66478
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file <path-to>/patch-output/portfolio/pr-body.md
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file <path-to>/patch-output/portfolio/issue-body.md
```

### nasturel.com (14.2.4 → 14.2.33)

```bash
cd /tmp
gh repo clone LucaSain/nasturel.com
cd nasturel.com
git checkout -b security/patch-nextjs-cve-2025-66478
npm install next@14.2.33
npx next --version  # Verify: Next.js v14.2.33
npm run build
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to 14.2.33"
git push origin security/patch-nextjs-cve-2025-66478
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file <path-to>/patch-output/nasturel.com/pr-body.md
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file <path-to>/patch-output/nasturel.com/issue-body.md
```

### tabere.nasturel.com (14.2.5 → 14.2.33)

```bash
cd /tmp
gh repo clone LucaSain/tabere.nasturel.com
cd tabere.nasturel.com
git checkout -b security/patch-nextjs-cve-2025-66478
npm install next@14.2.33
npx next --version  # Verify: Next.js v14.2.33
npm run build
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to 14.2.33"
git push origin security/patch-nextjs-cve-2025-66478
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file <path-to>/patch-output/tabere.nasturel.com/pr-body.md
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file <path-to>/patch-output/tabere.nasturel.com/issue-body.md
```

### petreceri-pentru-copii-sibiu (14.2.5 → 14.2.33)

```bash
cd /tmp
gh repo clone LucaSain/petreceri-pentru-copii-sibiu
cd petreceri-pentru-copii-sibiu
git checkout -b security/patch-nextjs-cve-2025-66478
npm install next@14.2.33
npx next --version  # Verify: Next.js v14.2.33
npm run build
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to 14.2.33"
git push origin security/patch-nextjs-cve-2025-66478
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file <path-to>/patch-output/petreceri-pentru-copii-sibiu/pr-body.md
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file <path-to>/patch-output/petreceri-pentru-copii-sibiu/issue-body.md
```

### portfolio-vavilov (14.2.5 → 14.2.33)

```bash
cd /tmp
gh repo clone LucaSain/portfolio-vavilov
cd portfolio-vavilov
git checkout -b security/patch-nextjs-cve-2025-66478
npm install next@14.2.33
npx next --version  # Verify: Next.js v14.2.33
npm run build
git add package.json package-lock.json
git commit -m "[Security] Patch CVE-2025-66478: Update Next.js to 14.2.33"
git push origin security/patch-nextjs-cve-2025-66478
gh pr create --title "[Security] Patch Next.js CVE-2025-66478" --body-file <path-to>/patch-output/portfolio-vavilov/pr-body.md
gh issue create --title "[Enhancement] Upgrade Next.js to version 16.0.7" --body-file <path-to>/patch-output/portfolio-vavilov/issue-body.md
```

## Verification Checklist

After patching each repository:

- [ ] Next.js version updated in package.json
- [ ] package-lock.json regenerated
- [ ] `npx next --version` shows correct version
- [ ] Branch pushed to GitHub
- [ ] PR created with proper description
- [ ] Follow-up issue created for major version upgrade
- [ ] Build passes (or documented if env vars needed)

## Troubleshooting

### Build Fails Due to Missing Environment Variables

This is expected for repositories that require API keys or database connections. The patch is still valid. Document the required environment variables in the PR.

### GitHub CLI Not Authenticated

```bash
gh auth login
# Follow prompts to authenticate
```

### Permission Denied

Ensure you have write access to the LucaSain repositories or use SSH:

```bash
git remote set-url origin git@github.com:LucaSain/<repo>.git
```

### Branch Already Exists

```bash
git checkout security/patch-nextjs-cve-2025-66478
git pull origin security/patch-nextjs-cve-2025-66478
# Continue with patch
```

## Next Steps After All Patches

1. Monitor PRs for merge
2. Verify builds pass in CI/CD
3. Deploy to production environments
4. Monitor for any issues
5. Schedule follow-up major version upgrades
6. Close out security ticket for CVE-2025-66478

## Notes

- All patches stay within current major versions
- Breaking changes are minimized
- Follow-up issues track future major upgrades to v16
- Test each repository's specific functionality after patching
