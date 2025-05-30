import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Discord API endpoints
const DISCORD_API_BASE = 'https://discord.com/api/v10'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: bot, error } = await supabase
      .from('bots')
      .select(`
        *,
        client:clients(id, name, industry)
      `)
      .eq('id', id)
      .single()

    if (error || !bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ bot })
  } catch (error) {
    console.error('Error fetching bot:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updates = await request.json()

    // Remove readonly fields
    const { discord_bot_id, created_at, deployment_id, server_endpoint, ...allowedUpdates } = updates

    const { data: bot, error } = await supabase
      .from('bots')
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        client:clients(id, name, industry)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update bot' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bot })
  } catch (error) {
    console.error('Error updating bot:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get bot details first
    const { data: bot, error: fetchError } = await supabase
      .from('bots')
      .select('discord_bot_id, discord_token, deployment_id')
      .eq('id', id)
      .single()

    if (fetchError || !bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    // Stop the bot deployment
    if (bot.deployment_id) {
      await stopBotDeployment(bot.deployment_id)
    }

    // Delete Discord application
    if (bot.discord_bot_id && bot.discord_token) {
      await deleteDiscordApplication(bot.discord_bot_id, bot.discord_token)
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('bots')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete bot from database' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bot:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

async function stopBotDeployment(deploymentId: string) {
  try {
    // In production, this would stop the actual bot process
    // For now, simulate the operation
    console.log(`Stopping bot deployment: ${deploymentId}`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Error stopping bot deployment:', error)
  }
} 