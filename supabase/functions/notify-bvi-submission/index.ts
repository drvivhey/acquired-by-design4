import { corsHeaders } from '@supabase/supabase-js/cors'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const BodySchema = z.object({
  firstName: z.string().min(1),
  businessName: z.string().min(1),
  email: z.string().email(),
  totalScore: z.number(),
  bandName: z.string(),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { firstName, businessName, email, totalScore, bandName } = parsed.data

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured')
      return new Response(JSON.stringify({ error: 'Gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const emailResponse = await fetch('https://connector-gateway.lovable.dev/resend/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'BVI Assessment <onboarding@resend.dev>',
        to: ['vivienne@wellspringexit.co.uk'],
        subject: `New BVI submission: ${businessName} (${totalScore}/100)`,
        html: `
          <h2>New Business Value Index submission</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${firstName}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Business</td><td style="padding:6px 12px;">${businessName}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Score</td><td style="padding:6px 12px;">${totalScore}/100 (${bandName})</td></tr>
          </table>
        `,
      }),
    })

    const emailResult = await emailResponse.json()
    console.log('Email send result:', emailResult)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
