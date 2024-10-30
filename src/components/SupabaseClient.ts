import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://uoaqpcsbemezoyfvrpbf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYXFwY3NiZW1lem95ZnZycGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5MzE4OTAsImV4cCI6MjA0MjUwNzg5MH0.nD_iWXbvqxQ5xKI23265K6jwXvApLeTGEmVsNCo3zb0'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;