import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Discord API endpoints
const DISCORD_API_BASE = 'https://discord.com/api/v10'

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side operations
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
      webhook_url
    } = body

    // Validate required fields
    if (!name || !client_id || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: name, client_id, template' },
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

    // Get Discord bot token from environment
    const discordBotToken = process.env.DISCORD_BOT_TOKEN
    if (!discordBotToken) {
      return NextResponse.json(
        { error: 'Discord bot token not configured' },
        { status: 500 }
      )
    }

    // Create Discord application
    const discordApp = await createDiscordApplication(name, description, discordBotToken)
    if (!discordApp) {
      return NextResponse.json(
        { error: 'Failed to create Discord application' },
        { status: 500 }
      )
    }

    // Store bot information in database using Supabase client
    const { data: botData, error: dbError } = await supabase
      .from('bots')
      .insert({
        name,
        client_id,
        discord_bot_id: discordApp.id,
        discord_token: discordApp.bot.token,
        template,
        prefix,
        description,
        auto_deploy,
        status: 'Offline', // Bots start offline until deployed
        invite_url: `https://discord.com/api/oauth2/authorize?client_id=${discordApp.id}&permissions=8&scope=bot`,
        avatar_url,
        webhook_url
      })
      .select()
      .single()

    if (dbError || !botData) {
      // Cleanup Discord app if database save fails
      await deleteDiscordApplication(discordApp.id, discordBotToken)
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
        id: discordApp.id,
        name: discordApp.name,
        invite_url: `https://discord.com/api/oauth2/authorize?client_id=${discordApp.id}&permissions=8&scope=bot`
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

async function createDiscordApplication(name: string, description: string, botToken: string) {
  try {
    // Create Discord application
    const appResponse = await fetch(`${DISCORD_API_BASE}/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description: description || `${name} - Referral bot created by Virion Labs`
      })
    })

    if (!appResponse.ok) {
      throw new Error(`Discord API error: ${appResponse.status}`)
    }

    const application = await appResponse.json()

    // Create bot user for the application
    const botResponse = await fetch(`${DISCORD_API_BASE}/applications/${application.id}/bot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!botResponse.ok) {
      throw new Error(`Discord Bot creation error: ${botResponse.status}`)
    }

    const bot = await botResponse.json()

    return {
      ...application,
      bot
    }
  } catch (error) {
    console.error('Error creating Discord application:', error)
    return null
  }
}

async function deleteDiscordApplication(applicationId: string, botToken: string) {
  try {
    await fetch(`${DISCORD_API_BASE}/applications/${applicationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error deleting Discord application:', error)
  }
} 