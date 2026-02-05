
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    process.exit(1);
}

let content = fs.readFileSync(envPath, 'utf8');

// Get the correct ID from NEXT_PUBLIC_SUPABASE_URL
const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL=https:\/\/([^.]+)\.supabase\.co/);
if (!urlMatch) {
    console.error('Could not find NEXT_PUBLIC_SUPABASE_URL in .env.local');
    process.exit(1);
}

const correctId = urlMatch[1];
console.log('Target Project ID:', correctId);

// Update DATABASE_URL username part
// It matches: postgres.[ANY_ID]:[PASSWORD]@...
const dbUrlRegex = /DATABASE_URL=postgresql:\/\/postgres\.([^:]+):/g;
const hasMatch = content.match(dbUrlRegex);

if (!hasMatch) {
    // Try matching without the dot if it's just postgres:
    const dbUrlRegex2 = /DATABASE_URL=postgresql:\/\/postgres:([^@]+)@/g;
    if (content.match(dbUrlRegex2)) {
        content = content.replace(dbUrlRegex2, (match, p1) => {
            return `DATABASE_URL=postgresql://postgres.${correctId}:${p1}@`;
        });
    } else {
        console.error('Could not find DATABASE_URL pattern to fix');
    }
} else {
    content = content.replace(dbUrlRegex, (match, p1) => {
        return `DATABASE_URL=postgresql://postgres.${correctId}:`;
    });
}

// Also fix the hostname if it has that weird postgrest-1 part
content = content.replace(/postgrest-1\.pooler\.supabase\.com/g, 'pooler.supabase.com');

fs.writeFileSync(envPath, content);
console.log('✅ .env.local has been updated with the correct Project ID in DATABASE_URL.');
