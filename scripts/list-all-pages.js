
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lchpcrquxjcnpubjqlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaHBjcnF1eGpjbnB1YmpxbG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1MjI4MSwiZXhwIjoyMDg1NzI4MjgxfQ.FYy2gDaaXBrx54noxRY9gcwMp2YE_x2dPTioQs1-JYE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllPages() {
    const { data, error } = await supabase
        .from('pages')
        .select('title, slug, layout');

    if (error) {
        console.error('Error:', error);
    } else {
        data.filter(p => p.layout?.images && p.layout.images.length > 0).forEach(p => {
            console.log(`Page: ${p.title} (${p.slug})`);
            console.log(`Images:`, p.layout?.images);
            console.log('---');
        });
    }
}

listAllPages();
