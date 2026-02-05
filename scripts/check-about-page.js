
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lchpcrquxjcnpubjqlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaHBjcnF1eGpjbnB1YmpxbG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1MjI4MSwiZXhwIjoyMDg1NzI4MjgxfQ.FYy2gDaaXBrx54noxRY9gcwMp2YE_x2dPTioQs1-JYE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPage() {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'gioi-thieu')
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Images:', data.layout?.images);
    }
}

checkPage();
