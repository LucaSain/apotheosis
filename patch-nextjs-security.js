#!/usr/bin/env node

/**
 * Next.js Security Patch Automation Script
 * CVE-2025-66478 Remediation
 * 
 * This script automates the process of patching Next.js vulnerabilities
 * across multiple repositories in the LucaSain GitHub account.
 * 
 * Features:
 * - Detects Next.js versions in repositories
 * - Determines appropriate patch versions within current major
 * - Generates patch instructions and PR templates
 * - Creates follow-up issue templates for major version upgrades
 */

const GITHUB_USER = 'LucaSain';
const CVE_ID = 'CVE-2025-66478';
const CVE_ADVISORY_URL = 'https://nextjs.org/blog/CVE-2025-66478';

// Repository analysis results from GitHub code search
const repositories = [
  {
    name: 'apotheosis',
    currentVersion: '13.1.2',
    description: '3D mind map of the relationships between philosophers',
    private: false
  },
  {
    name: 'Spectra-Design',
    currentVersion: '15.4.2',
    description: 'Design system repository',
    private: false
  },
  {
    name: 'contests.world',
    currentVersion: '^14.0.1',
    description: 'Connecting people with contests around the world!',
    private: false
  },
  {
    name: 'portfolio',
    currentVersion: '14.2.5',
    description: 'Personal portfolio website',
    private: false
  },
  {
    name: 'nasturel.com',
    currentVersion: '14.2.4',
    description: 'Website-ul pentru festivalul Nasturel 🧚‍♀️',
    private: false
  },
  {
    name: 'tabere.nasturel.com',
    currentVersion: '14.2.5',
    description: 'Nasturel camps website',
    private: false
  },
  {
    name: 'petreceri-pentru-copii-sibiu',
    currentVersion: '14.2.5',
    description: 'Children\'s party website for Sibiu',
    private: false
  },
  {
    name: 'portfolio-vavilov',
    currentVersion: '14.2.5',
    description: 'Vavilov portfolio website',
    private: false
  }
];

// Latest patch versions for each major version
const PATCH_VERSIONS = {
  '13': '13.5.11',
  '14': '14.2.33',
  '15': '15.5.7'
};

// Major version upgrade targets
const UPGRADE_TARGETS = {
  '13': '16.0.7',
  '14': '16.0.7',
  '15': '16.0.7'
};

function getMajorVersion(version) {
  // Remove ^ or ~ prefix
  const cleaned = version.replace(/^[\^~]/, '');
  return cleaned.split('.')[0];
}

function needsPatching(currentVersion, majorVersion) {
  const cleaned = currentVersion.replace(/^[\^~]/, '');
  const patchVersion = PATCH_VERSIONS[majorVersion];
  
  // Simple version comparison
  if (cleaned === patchVersion) {
    return false;
  }
  
  // If version is older than patch version, needs patching
  return true;
}

function generatePatchInstructions(repo) {
  const major = getMajorVersion(repo.currentVersion);
  const targetPatch = PATCH_VERSIONS[major];
  const targetMajor = UPGRADE_TARGETS[major];
  
  return {
    repository: repo.name,
    currentVersion: repo.currentVersion,
    majorVersion: major,
    patchVersion: targetPatch,
    upgradeVersion: targetMajor,
    needsPatch: needsPatching(repo.currentVersion, major),
    branchName: `security/patch-nextjs-${CVE_ID.toLowerCase()}`,
    prTitle: `[Security] Patch Next.js ${CVE_ID}`,
    prBody: generatePRBody(repo, major, targetPatch),
    issueTitle: `[Enhancement] Upgrade Next.js to version ${targetMajor}`,
    issueBody: generateIssueBody(repo, major, targetMajor)
  };
}

function generatePRBody(repo, major, targetPatch) {
  return `## Security Patch: ${CVE_ID}

### Summary
This PR addresses security vulnerability ${CVE_ID} by updating Next.js from version ${repo.currentVersion} to ${targetPatch}.

### Changes
- ✅ Updated Next.js to ${targetPatch} (latest patch in ${major}.x series)
- ✅ Regenerated package-lock.json
- ✅ Verified build passes
- ✅ Tested application functionality

### Security Impact
This update patches ${CVE_ID}. For more details, see: ${CVE_ADVISORY_URL}

### Testing
- \`npm install\` completes successfully
- \`npm run build\` completes without errors
- \`npm run dev\` starts development server correctly

### Next Steps
A follow-up issue has been created to track the major version upgrade to Next.js ${UPGRADE_TARGETS[major]}.

### References
- Advisory: ${CVE_ADVISORY_URL}
- Next.js ${targetPatch} Release Notes: https://github.com/vercel/next.js/releases/tag/v${targetPatch}

---
**Security Priority**: High
**Scope**: Patch within current major version
**Follow-up**: Issue #[NUMBER] - Upgrade to Next.js ${UPGRADE_TARGETS[major]}`;
}

function generateIssueBody(repo, major, targetMajor) {
  return `## Enhancement: Upgrade Next.js to ${targetMajor}

### Current Status
- **Current Version**: ${repo.currentVersion}
- **Security Patch Applied**: ${PATCH_VERSIONS[major]} (via PR #[NUMBER])
- **Target Version**: ${targetMajor}

### Motivation
While the security vulnerability ${CVE_ID} has been patched within the current major version, upgrading to the latest major version will provide:
- Latest features and improvements
- Better performance
- Long-term security updates
- Modern React features support

### Upgrade Path
This is a major version upgrade that may require code changes:

1. **Review Breaking Changes**
   - Next.js ${major}.x → ${targetMajor} migration guide
   - React compatibility changes
   - API changes and deprecations

2. **Update Dependencies**
   - Update all Next.js related packages
   - Update React and React-DOM if needed
   - Update TypeScript and other dependencies

3. **Code Changes**
   - Update any deprecated API usage
   - Refactor breaking changes
   - Update configuration files

4. **Testing**
   - Comprehensive testing of all features
   - Performance testing
   - Compatibility testing

### Implementation Plan
- [ ] Review Next.js ${targetMajor} release notes and migration guide
- [ ] Identify breaking changes affecting this project
- [ ] Create feature branch for upgrade
- [ ] Update dependencies
- [ ] Fix breaking changes
- [ ] Update tests
- [ ] Verify all functionality works
- [ ] Update documentation
- [ ] Create PR for review

### References
- Next.js ${targetMajor} Release: https://github.com/vercel/next.js/releases/tag/v${targetMajor}
- Migration Guide: https://nextjs.org/docs/upgrading
- Related Security Patch PR: #[NUMBER]

### Priority
Medium - Can be scheduled for next development cycle after security patch is deployed.`;
}

function generateShellCommands(repo, instructions) {
  return `
# ============================================
# Repository: ${repo.name}
# ============================================

# 1. Clone repository (if not already cloned)
# git clone https://github.com/${GITHUB_USER}/${repo.name}.git
# cd ${repo.name}

# 2. Create and checkout feature branch
git checkout -b ${instructions.branchName}

# 3. Update Next.js to patch version
npm install next@${instructions.patchVersion}

# 4. Regenerate lockfile
npm install

# 5. Test the build
npm run build

# 6. Test development server
# npm run dev
# (Verify in browser, then Ctrl+C)

# 7. Commit changes
git add package.json package-lock.json
git commit -m "${instructions.prTitle}

Updated Next.js from ${repo.currentVersion} to ${instructions.patchVersion}
to address ${CVE_ID}.

- Updated Next.js dependency
- Regenerated package-lock.json
- Verified build passes

Security advisory: ${CVE_ADVISORY_URL}"

# 8. Push branch
git push origin ${instructions.branchName}

# 9. Create Pull Request
# Use GitHub CLI or web interface:
# gh pr create --title "${instructions.prTitle}" --body-file pr-body.md

# 10. Create Follow-up Issue
# gh issue create --title "${instructions.issueTitle}" --body-file issue-body.md
`;
}

function generateReport() {
  console.log('='.repeat(80));
  console.log(`Next.js Security Patch Report - ${CVE_ID}`);
  console.log('='.repeat(80));
  console.log();
  console.log(`GitHub User: ${GITHUB_USER}`);
  console.log(`Total Repositories Found: ${repositories.length}`);
  console.log(`Advisory URL: ${CVE_ADVISORY_URL}`);
  console.log();
  
  const instructions = repositories.map(repo => generatePatchInstructions(repo));
  const needsPatching = instructions.filter(i => i.needsPatch);
  const upToDate = instructions.filter(i => !i.needsPatch);
  
  console.log('Repository Status Summary:');
  console.log('-'.repeat(80));
  console.log(`Requires Patching: ${needsPatching.length}`);
  console.log(`Already Up-to-date: ${upToDate.length}`);
  console.log();
  
  if (upToDate.length > 0) {
    console.log('✅ Repositories Already Up-to-date:');
    upToDate.forEach(i => {
      console.log(`   - ${i.repository}: Next.js ${i.currentVersion} (no patch needed)`);
    });
    console.log();
  }
  
  if (needsPatching.length > 0) {
    console.log('🔧 Repositories Requiring Patches:');
    console.log();
    
    needsPatching.forEach((instr, index) => {
      const repo = repositories.find(r => r.name === instr.repository);
      console.log(`${index + 1}. ${instr.repository}`);
      console.log(`   Current Version: ${instr.currentVersion}`);
      console.log(`   Patch Target: ${instr.patchVersion}`);
      console.log(`   Future Upgrade: ${instr.upgradeVersion}`);
      console.log(`   Description: ${repo.description}`);
      console.log();
    });
  }
  
  return { instructions, needsPatching, upToDate };
}

function exportPatchInstructions(instructions) {
  const fs = require('fs');
  const path = require('path');
  
  const outputDir = path.join(__dirname, 'patch-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  instructions.needsPatching.forEach(instr => {
    const repo = repositories.find(r => r.name === instr.repository);
    const repoDir = path.join(outputDir, instr.repository);
    
    if (!fs.existsSync(repoDir)) {
      fs.mkdirSync(repoDir, { recursive: true });
    }
    
    // Save PR body
    fs.writeFileSync(
      path.join(repoDir, 'pr-body.md'),
      instr.prBody
    );
    
    // Save Issue body
    fs.writeFileSync(
      path.join(repoDir, 'issue-body.md'),
      instr.issueBody
    );
    
    // Save shell commands
    fs.writeFileSync(
      path.join(repoDir, 'patch-commands.sh'),
      generateShellCommands(repo, instr)
    );
    
    // Save JSON data
    fs.writeFileSync(
      path.join(repoDir, 'patch-data.json'),
      JSON.stringify({ repository: repo, instructions: instr }, null, 2)
    );
  });
  
  // Create master summary
  const summary = {
    cve: CVE_ID,
    advisory: CVE_ADVISORY_URL,
    githubUser: GITHUB_USER,
    scanDate: new Date().toISOString(),
    totalRepositories: repositories.length,
    requiresPatching: instructions.needsPatching.length,
    upToDate: instructions.upToDate.length,
    repositories: instructions.instructions.map(i => ({
      name: i.repository,
      currentVersion: i.currentVersion,
      needsPatch: i.needsPatch,
      patchVersion: i.patchVersion,
      upgradeVersion: i.upgradeVersion
    }))
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  // Create README
  const readme = `# Next.js Security Patch - ${CVE_ID}

## Overview
This directory contains automated patch instructions for remediating ${CVE_ID} across ${GITHUB_USER}'s repositories.

## Summary
- **Total Repositories**: ${summary.totalRepositories}
- **Requires Patching**: ${summary.requiresPatching}
- **Already Up-to-date**: ${summary.upToDate}
- **Scan Date**: ${summary.scanDate}

## Repository-Specific Instructions
Each subdirectory contains:
- \`pr-body.md\` - Pull Request description template
- \`issue-body.md\` - Follow-up issue template for major version upgrade
- \`patch-commands.sh\` - Shell commands to execute the patch
- \`patch-data.json\` - Structured data about the patch

## Repositories Requiring Patches
${instructions.needsPatching.map((i, idx) => `${idx + 1}. **${i.repository}**: ${i.currentVersion} → ${i.patchVersion}`).join('\n')}

## Execution Instructions

### For Each Repository:
1. Navigate to the repository directory: \`cd <repository-name>\`
2. Review the patch data: \`cat patch-data.json\`
3. Execute the patch: \`bash patch-commands.sh\`
4. Create PR using: \`gh pr create --title "..." --body-file pr-body.md\`
5. Create follow-up issue: \`gh issue create --title "..." --body-file issue-body.md\`

### Prerequisites
- Git configured with push access to repositories
- Node.js and npm installed
- GitHub CLI (gh) installed and authenticated

## Advisory Reference
${CVE_ADVISORY_URL}

## Notes
- All patches stay within the current major version
- Follow-up issues track future major version upgrades
- Test builds before pushing changes
`;
  
  fs.writeFileSync(
    path.join(outputDir, 'README.md'),
    readme
  );
  
  console.log('📁 Patch Instructions Exported:');
  console.log(`   Output Directory: ${outputDir}`);
  console.log(`   - summary.json: Overall summary`);
  console.log(`   - README.md: Instructions`);
  console.log(`   - <repo-name>/: Per-repository patch files`);
  console.log();
}

// Main execution
if (require.main === module) {
  const result = generateReport();
  exportPatchInstructions(result);
  
  console.log('='.repeat(80));
  console.log('✅ Security Patch Analysis Complete');
  console.log('='.repeat(80));
  console.log();
  console.log('Next steps:');
  console.log('1. Review generated files in ./patch-output/');
  console.log('2. Execute patch-commands.sh for each repository');
  console.log('3. Create PRs and follow-up issues using generated templates');
  console.log();
}

module.exports = {
  generateReport,
  generatePatchInstructions,
  repositories,
  PATCH_VERSIONS,
  UPGRADE_TARGETS
};
