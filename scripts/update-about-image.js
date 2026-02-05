
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lchpcrquxjcnpubjqlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaHBjcnF1eGpjbnB1YmpxbG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1MjI4MSwiZXhwIjoyMDg1NzI4MjgxfQ.FYy2gDaaXBrx54noxRY9gcwMp2YE_x2dPTioQs1-JYE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateImage() {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'gioi-thieu')
        .single();

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    const images = data.layout?.images || [];
    if (images.length === 0) {
        console.log('No images found in layout.images');
        return;
    }

    const newImageUrl = images[0];
    let body = data.layout.body;

    // Replace /about-hero.jpg with the new image URL
    body = body.replace('/about-hero.jpg', newImageUrl);

    const { error: updateError } = await supabase
        .from('pages')
        .update({
            layout: {
                ...data.layout,
                body: body
            }
        })
        .eq('id', data.id);

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log('Successfully updated image to:', newImageUrl);
    }
}

updateImage();
