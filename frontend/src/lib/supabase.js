import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qoxczgyeamhsuxmxhpzr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveGN6Z3llYW1oc3V4bXhocHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2ODQwNTksImV4cCI6MjA4NTI2MDA1OX0.OTFCNPV_-w_Y2JUQqziIc_rdeNppB1Uf50j2li5RKuM'
)
