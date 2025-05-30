# Discord Bot Creation & Deployment Setup

This guide explains how to set up the Discord bot creation and deployment system in your Virion Labs Dashboard.

## Overview

The system automatically:
1. **Creates Discord Applications** via Discord API
2. **Generates Bot Code** from templates (Standard, Advanced, Custom)
3. **Deploys Bots** to your infrastructure (Docker, PM2, or Serverless)
4. **Manages Bot Lifecycle** (Start, Stop, Restart, Monitor)

## Prerequisites

### 1. Discord Bot Token (Required)

You need a Discord bot token with application creation permissions:

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token
5. Add to your environment variables:

```bash
DISCORD_BOT_TOKEN=your_bot_token_here
```

### 2. Database Schema Updates

Add the new fields to your `bots` table:

```sql
ALTER TABLE bots 
ADD COLUMN deployment_id TEXT,
ADD COLUMN server_endpoint TEXT;
```

### 3. Environment Configuration

Add these environment variables to your `.env.local`:

```bash
# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token

# Deployment Method (optional, defaults to simulation)
DEPLOYMENT_METHOD=docker  # Options: docker, pm2, serverless, or leave empty for simulation

# Bot Hosting Domain (optional)
BOT_HOSTING_DOMAIN=bots.yourdomain.com
```

## Deployment Methods

### Option 1: Docker Deployment (Recommended)

**Requirements:**
- Docker installed on your server
- Docker daemon running

**Setup:**
```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Set deployment method
echo "DEPLOYMENT_METHOD=docker" >> .env.local
```

**How it works:**
- Creates a Docker container for each bot
- Automatically builds and deploys bot code
- Supports start/stop/restart operations
- Isolated environment for each bot

### Option 2: PM2 Deployment

**Requirements:**
- Node.js installed
- PM2 process manager

**Setup:**
```bash
# Install PM2 globally
npm install -g pm2

# Set deployment method
echo "DEPLOYMENT_METHOD=pm2" >> .env.local
```

**How it works:**
- Uses PM2 to manage bot processes
- Automatic restart on crashes
- Process monitoring and logs
- Suitable for VPS/dedicated servers

### Option 3: Serverless Deployment

**Requirements:**
- Serverless platform account (Vercel, Netlify, AWS Lambda)
- Platform-specific configuration

**Setup:**
```bash
# Set deployment method
echo "DEPLOYMENT_METHOD=serverless" >> .env.local
```

**Note:** Currently returns simulated results. Implement platform-specific deployment logic in `lib/bot-deployment.ts`.

### Option 4: Simulation Mode (Default)

**Setup:**
No additional setup required. Bots will be "deployed" but not actually run.

**Use cases:**
- Development and testing
- Demo environments
- When you don't have deployment infrastructure ready

## Bot Templates

### Standard Template
- Basic referral commands (`/refer`, `/stats`, `/leaderboard`)
- Simple text responses
- Suitable for basic referral tracking

### Advanced Template
- Rich embed messages
- Platform-specific referral links
- Detailed analytics commands
- Sub-commands for different platforms

### Custom Template
- Minimal bot structure
- Easy to customize
- Message-based commands with prefix

## API Endpoints

### Create Bot
```
POST /api/bots/create
```

**Body:**
```json
{
  "name": "My Referral Bot",
  "client_id": "client_uuid",
  "template": "standard",
  "prefix": "!",
  "description": "Bot description",
  "auto_deploy": true
}
```

### Control Bot
```
POST /api/bots/{id}/control
```

**Body:**
```json
{
  "action": "start" // or "stop", "restart"
}
```

## Features

### Automatic Discord App Creation
- Creates Discord application automatically
- Generates bot user
- Sets up proper permissions
- Provides invite URL

### Code Generation
- Template-based bot code generation
- Configurable commands and responses
- Ready-to-deploy Discord.js bots

### Deployment Management
- Multiple deployment strategies
- Environment variable management
- Process lifecycle control
- Status monitoring

### Dashboard Integration
- Real-time status updates
- Control buttons (Start/Stop/Restart)
- Deployment logs and monitoring
- Bot configuration management

## Troubleshooting

### Common Issues

**1. Discord API Errors**
```
Error: Discord API error: 401
```
- Check your Discord bot token
- Ensure token has proper permissions
- Verify token is not expired

**2. Deployment Failures**
```
Error: Docker deployment failed
```
- Check if Docker is running
- Verify Docker permissions
- Check available disk space

**3. Bot Won't Start**
```
Error: Failed to connect to Discord
```
- Verify bot token is valid
- Check Discord API status
- Ensure bot has necessary intents

### Debug Mode

Enable debug logging:
```bash
DEBUG_BOTS=true
LOG_LEVEL=debug
```

### Logs Location

- **Docker:** `docker logs bot_{deploymentId}`
- **PM2:** `pm2 logs bot_{deploymentId}`
- **Application:** Check console output

## Security Considerations

### Token Management
- Store Discord tokens securely
- Use environment variables
- Never commit tokens to git
- Rotate tokens regularly

### Bot Permissions
- Use minimal required permissions
- Review Discord permission calculator
- Audit bot access regularly

### Deployment Security
- Use non-root users for deployment
- Secure deployment directories
- Monitor resource usage
- Implement rate limiting

## Scaling Considerations

### Resource Management
- Monitor CPU and memory usage
- Set container resource limits
- Implement auto-scaling if needed

### Database Performance
- Index frequently queried fields
- Monitor query performance
- Consider read replicas for analytics

### Network Security
- Use HTTPS for all API calls
- Implement proper CORS policies
- Monitor network traffic

## Advanced Configuration

### Custom Bot Code

You can modify bot templates in `app/api/bots/create/route.ts`:

```javascript
function generateCustomBot(config) {
  return `
    // Your custom bot code here
    const { Client } = require('discord.js');
    // ... custom implementation
  `;
}
```

### Custom Deployment Logic

Extend the deployment manager in `lib/bot-deployment.ts`:

```javascript
private async deployWithCustomMethod(
  deploymentPath: string, 
  config: BotDeploymentConfig, 
  deploymentId: string
): Promise<DeploymentResult> {
  // Your custom deployment logic
}
```

### Webhook Integration

Add webhook notifications for bot events:

```javascript
// In your bot code
const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });
webhook.send('Bot started successfully!');
```

## Production Checklist

- [ ] Discord bot token configured
- [ ] Database schema updated
- [ ] Deployment method chosen and configured
- [ ] Security measures implemented
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] Documentation updated

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Test with simulation mode first

## Contributing

To contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit a pull request

---

**Note:** This implementation provides a foundation for Discord bot deployment. Customize according to your specific infrastructure and requirements. 