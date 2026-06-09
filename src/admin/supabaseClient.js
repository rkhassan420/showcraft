// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://psayyzbyeelgirwdzoyg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYXl5emJ5ZWVsZ2lyd2R6b3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MDMzMjYsImV4cCI6MjA2NzE3OTMyNn0.S7e9FKq0pOjxIyEcDsKW67wjP97sW7OPLZwK-NrqrCg'

export const supabase = createClient(supabaseUrl, supabaseKey)
