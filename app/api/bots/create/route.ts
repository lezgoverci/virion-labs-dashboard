import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Discord API endpoints
const DISCORD_API_BASE = 'https://discord.com/api/v10'

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      client_id,
      template,
      prefix = '!',
      description,
      auto_deploy = false,
      avatar_url,
      webhook_url,
      discord_application_id,
      discord_bot_token
    } = body

    // Validate required fields
    if (!name || !client_id || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: name, client_id, template' },
        { status: 400 }
      )
    }

    // For now, we'll require manual Discord application details
    if (!discord_application_id || !discord_bot_token) {
      return NextResponse.json(
        { error: 'Missing Discord application details. Please provide discord_application_id and discord_bot_token' },
        { status: 400 }
      )
    }

    // Validate client exists using Supabase client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id, name')
      .eq('id', client_id)
      .eq('status', 'Active')
      .single()

    if (clientError || !clientData) {
      return NextResponse.json(
        { error: 'Invalid or inactive client' },
        { status: 400 }
      )
    }

    // Validate the Discord bot token by testing it
    const isValidToken = await validateDiscordBotToken(discord_bot_token, discord_application_id)
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid Discord bot token or application ID' },
        { status: 400 }
      )
    }

    // Store bot information in database using Supabase client
    const { data: botData, error: dbError } = await supabase
      .from('bots')
      .insert({
        name,
        client_id,
        discord_bot_id: discord_application_id,
        discord_token: discord_bot_token,
        template,
        prefix,
        description,
        auto_deploy,
        status: 'Offline', // Bots start offline until deployed
        invite_url: `https://discord.com/api/oauth2/authorize?client_id=${discord_application_id}&permissions=8&scope=bot`,
        avatar_url,
        webhook_url
      })
      .select()
      .single()

    if (dbError || !botData) {
      return NextResponse.json(
        { error: 'Failed to save bot to database: ' + (dbError?.message || 'Unknown error') },
        { status: 500 }
      )
    }

    // Update client bot count
    const { data: currentClient } = await supabase
      .from('clients')
      .select('bots')
      .eq('id', client_id)
      .single()

    const { error: updateError } = await supabase
      .from('clients')
      .update({ 
        bots: (currentClient?.bots || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', client_id)

    if (updateError) {
      console.warn('Failed to update client bot count:', updateError)
    }

    return NextResponse.json({
      success: true,
      bot: botData,
      discord_app: {
        id: discord_application_id,
        name: name,
        invite_url: `https://discord.com/api/oauth2/authorize?client_id=${discord_application_id}&permissions=8&scope=bot`
      }
    })

  } catch (error) {
    console.error('Error creating Discord bot:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function validateDiscordBotToken(token: string, applicationId: string) {
  try {
    // Test the bot token by getting application info
    const response = await fetch(`https://discord.com/api/v10/applications/@me`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Discord token validation failed:', response.status)
      return false
    }

    const appData = await response.json()
    
    // Verify the application ID matches
    if (appData.id !== applicationId) {
      console.error('Application ID mismatch')
      return false
    }

    return true
  } catch (error) {
    console.error('Error validating Discord token:', error)
    return false
  }
} 