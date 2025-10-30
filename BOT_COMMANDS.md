# ClipHub Discord Bot - Complete Command Reference

## 📋 Table of Contents
- [User Commands](#user-commands)
- [Admin Commands](#admin-commands)
- [Features Overview](#features-overview)
- [Account Management](#account-management)
- [Campaign System](#campaign-system)
- [Submission & Payout System](#submission--payout-system)
- [Stats & Analytics](#stats--analytics)
- [Moderation Tools](#moderation-tools)

---

## 👤 User Commands

### Account & Verification
- **`/linkaccount`** - Link your social media account for verification
  - Options: platform (YouTube/TikTok/Instagram), handle, url
  - Generates verification code and unique Account ID
  - Logs to MEMBER_LOGS_CHANNEL
  - Users can link multiple accounts per platform

- **`/verifyaccount`** - Submit your account for automatic verification
  - Options: platform, account_id (optional - use if you have multiple accounts)
  - Auto-checks bio for verification code
  - Creates support ticket if auto-verification fails
  - If you have multiple accounts, specify account_id to verify a specific one

- **`/myaccounts`** - View all your linked social media accounts
  - Shows Account IDs, verification status, handles, and verification codes
  - Displays total accounts and verified count

### Stats & Analytics
- **`/quickstats`** - Quick overview of your earnings and performance
  - Shows: Balance, Total Paid, Lifetime Earnings
  - Submissions: Approved, Pending, Total
  - Views: Total and average per clip
  - Top performing clip with link
  - Pending payout information

- **`/mystats`** - Detailed analytics dashboard
  - Comprehensive earnings breakdown
  - View statistics and performance metrics
  - Submission history and status

- **`/profile`** - View your complete profile
  - User information and verification status
  - Earnings summary
  - Campaign participation

- **`/rank`** - Check your leaderboard position
  - Your current rank
  - Earnings comparison
  - Views ranking

### Engagement Features
- **`/streaks`** - View your submission streak 🔥
  - Current streak (consecutive days)
  - Longest streak achieved
  - Last submission date
  - Milestone badges:
    - ⚡ 3+ days: Nice streak!
    - 💪 7+ days: One week strong!
    - 🔥 14+ days: You're on fire!
    - 🌟 30+ days: Legendary streak!

- **`/achievements`** - View unlocked achievements and progress 🏆
  - **First Steps** 🎬 - Submit your first clip
  - **Rising Star** 📹 - Get 10 clips approved
  - **Content Creator** 🌟 - Get 50 clips approved
  - **Clip Master** 👑 - Get 100 clips approved
  - **First Earnings** 💵 - Earn your first dollar
  - **Hundred Club** 💰 - Earn $100
  - **Thousand Club** 🏆 - Earn $1,000
  - **10K Views** 👁️ - Reach 10,000 total views
  - **100K Views** 🌐 - Reach 100,000 total views
  - **Million Views** 🚀 - Reach 1,000,000 total views
  - Shows progress bars for locked achievements

### Campaign Management
- **`/campaigns`** - Browse all active campaigns
  - Lists campaigns with rates, platforms, and budgets
  - View campaign details and requirements

- **`/submit`** - Submit a clip to a campaign
  - Choose campaign and platform
  - Provide video link
  - Upload analytics proof (optional)
  - Unlimited submissions per campaign

### Payout & Earnings
- **`/setpayout`** - Set your payout method and address
  - Options: PayPal, CashApp, Venmo, Bank Transfer, Crypto

- **`/requestpayout`** - Request a payout
  - Specify amount from your balance
  - Upload payment proof
  - Track payout status

### Leaderboard & Competition
- **`/leaderboard`** - View global earnings leaderboard
  - Top earners by lifetime earnings
  - Your position and rank
  - Compete for top spots

- **`/topinvites`** - View top inviters
  - Users who brought the most members
  - Invite tracking and rewards

### Social & Info
- **`/invites`** - Check your invite count and rewards
  - Total invites
  - Valid/active invites
  - Fake invite detection

- **`/help`** - Get help and command information
  - Lists all available commands
  - Usage instructions

- **`/botinfo`** - View bot information and stats
  - Bot uptime and version
  - Server statistics
  - System information

- **`/ping`** - Check bot latency
  - Response time
  - API latency

- **`/uptime`** - Check how long bot has been running
  - Days, hours, minutes

### Utility Commands
- **`/calculator`** - Calculate earnings
  - Input views and CPM rate
  - Get instant earnings estimate

- **`/feedback`** - Send feedback to admins
  - Report bugs
  - Suggest features
  - General feedback

- **`/avatar`** - View user's avatar
  - Shows user or mentioned user's profile picture

- **`/userinfo`** - View detailed user information
  - Account creation date
  - Roles and permissions
  - Join date

- **`/serverinfo`** - View server information
  - Member count
  - Server boost level
  - Creation date

- **`/channelinfo`** - View channel information
  - Channel type and category
  - Creation date and permissions

---

## 👨‍💼 Admin Commands

### Account Verification Management
- **`/verifyuser`** - Manually verify a user's account
  - Options: @user, account_id
  - Required for multi-account support
  - Use `/listaccounts` to see user's Account IDs
  - Logs verification to MEMBER_LOGS_CHANNEL

- **`/unverifyuser`** - Remove verification from an account
  - Options: @user, account_id
  - Revokes verified status
  - Logs action to MEMBER_LOGS_CHANNEL

- **`/listaccounts`** - View all linked accounts for a user
  - Shows all Account IDs with status
  - Platform, handle, verification status
  - Linked date and verified date
  - Use this before verifying to get correct Account ID

### Campaign Management
- **`/addcampaign`** - Create a new campaign
  - Set name, description, type
  - Configure platforms, rate per 1K views
  - Set budget and requirements
  - Auto-creates Discord role and channel

- **`/editcampaign`** - Edit existing campaign
  - Modify campaign parameters
  - Update rates and budgets
  - Change requirements

- **`/endcampaign`** - End a campaign
  - Stops new submissions
  - Archives campaign data
  - Removes Discord role and channel

- **`/pausecampaign`** - Temporarily pause a campaign
  - Stops new submissions
  - Preserves campaign data
  - Can be resumed later

### Submission Management
- **`/approveclip`** - Approve a submitted clip
  - Input current view count for accurate tracking
  - Calculates initial earnings
  - Updates user balance
  - Logs to SUBMISSION_LOGS_CHANNEL

- **`/rejectclip`** - Reject a submitted clip
  - Provide rejection reason
  - Notifies user
  - Logs action

- **`/flagclip`** - Flag a clip for review
  - Mark suspicious submissions
  - Add flag reason
  - Logs to FLAGGED_CLIPS_CHANNEL

- **`/updateviews`** - Manually update view count
  - For approved submissions only
  - Recalculates earnings
  - Updates campaign budget tracking
  - Logs to view_logs table

### Payout Management
- **`/approvepayout`** - Approve a payout request
  - Deducts from user balance
  - Marks as paid
  - Logs to PAYOUT_LOGS_CHANNEL

- **`/rejectpayout`** - Reject a payout request
  - Provide rejection reason
  - Returns balance to user
  - Notifies user

### User Management
- **`/approve`** - Approve a user for the platform
  - Grants verified clipper role
  - Unlocks features

- **`/ban`** - Ban a user from the server
  - Options: @user, reason, delete messages
  - Logs to MODERATION_LOGS_CHANNEL

- **`/unban`** - Unban a user
  - Options: user_id
  - Removes server ban

- **`/kick`** - Kick a user from server
  - Options: @user, reason
  - User can rejoin

- **`/banclipper`** - Ban user from creating clips
  - Prevents submissions
  - User stays in server
  - Logs action

- **`/bonus`** - Award bonus to a user
  - Add extra earnings
  - Specify amount and reason
  - Updates user balance

### Moderation Tools
- **`/warn`** - Warn a user
  - Issues formal warning
  - Logs to database
  - Tracks warning count

- **`/warnings`** - View user's warnings
  - Lists all warnings with reasons
  - Shows warning dates

- **`/timeout`** - Timeout a user
  - Mute for specified duration
  - Options: minutes/hours/days

- **`/mute`** - Mute a user indefinitely
  - Removes send message permission
  - Until manually unmuted

- **`/unmute`** - Unmute a user
  - Restores message permissions

- **`/lock`** - Lock a channel
  - Prevents members from sending messages
  - Mods can still post

- **`/unlock`** - Unlock a channel
  - Restores normal permissions

- **`/slowmode`** - Set channel slowmode
  - Options: seconds between messages
  - Range: 0-21600 seconds

- **`/clear`** - Bulk delete messages
  - Options: amount (1-100)
  - Cleans up spam

- **`/prune`** - Prune inactive members
  - Remove members who haven't been active
  - Options: days of inactivity

### Protection & Safety
- **`/nuke`** - Server protection mode
  - Emergency lockdown
  - Requires Nuke Master role
  - Kicks suspicious accounts
  - Logs all actions

- **`/nukeinfo`** - View nuke protection status
  - Shows protection level
  - Lists protected users

- **`/restorenuke`** - Restore after nuke
  - Reverses protection mode
  - Restores permissions

### System Management
- **`/announce`** - Send announcement
  - Post to announcements channel
  - Formatted embed
  - Optional @everyone ping

- **`/poll`** - Create a poll
  - Add question and options
  - Track votes
  - Auto-reactions

- **`/massdm`** - Send DM to all members
  - Options: role filter
  - Batch messaging
  - Rate limited

- **`/closeticket`** - Close a support ticket
  - Archives ticket channel
  - Saves transcript
  - Notifies user

- **`/reload`** - Reload bot commands
  - Refresh command handlers
  - Apply code updates
  - No restart needed

- **`/eval`** - Execute code (Developer only)
  - Run JavaScript code
  - Debug and testing
  - Restricted to bot owner

- **`/stats`** - View platform statistics
  - Total users, campaigns, submissions
  - Revenue tracking
  - Platform analytics

- **`/exportdata`** - Export platform data
  - Generate CSV/JSON exports
  - User data, submissions, payouts
  - For analytics and backups

### Role Management
- **`/roleadd`** - Add role to user
  - Options: @user, @role
  - Bulk role assignment

- **`/roleremove`** - Remove role from user
  - Options: @user, @role
  - Manage permissions

---

## 🎯 Features Overview

### Multi-Account System
- **Unlimited Accounts**: Link multiple YouTube channels, TikTok accounts, or Instagram profiles
- **Unique Account IDs**: Each account gets a trackable ID
- **Easy Management**: View all accounts with `/myaccounts`
- **Admin Tools**: Admins use `/listaccounts` to see user's accounts and verify specific ones
- **Logging**: All account links logged to MEMBER_LOGS_CHANNEL

### Automated View Tracking
- **Hourly Updates**: Auto-fetches view counts every hour
- **Multi-Platform**: YouTube, TikTok, Instagram, Twitter
- **API Integration**: YouTube Data API v3 for accurate tracking
- **Web Scraping Fallback**: RapidAPI for TikTok/Twitter/Instagram
- **Manual Override**: Admins can use `/updateviews` for corrections

### Intelligent Verification System
1. **API-First**: Attempts YouTube Data API verification
2. **Web Scraping**: Falls back to scraping bio/description
3. **Manual Review**: Creates support ticket if auto-verification fails
4. **Multi-Account**: Supports verifying multiple accounts per user

### Streak System
- **Daily Tracking**: Monitors consecutive submission days
- **Milestone Rewards**: Badges at 7, 14, and 30 days
- **Motivation**: Encourages consistent participation
- **Longest Streak**: Tracks personal best

### Achievement System
- **10 Unique Achievements**: From first clip to 1M views
- **Progress Tracking**: See how close you are to next unlock
- **Visual Progress Bars**: Track completion percentage
- **Gamification**: Makes earning more engaging

### Budget Tracking
- **Real-time Monitoring**: Track campaign budget usage
- **Milestone Alerts**: Notifications at 25%, 50%, 75%, 100%
- **Auto-pause**: Stops submissions when budget depleted
- **Visual Progress**: Progress bars on website and bot

### Payout System
- **Multiple Methods**: PayPal, CashApp, Venmo, Bank, Crypto
- **Proof Upload**: Attach payment screenshots
- **Analytics Proof**: Optional verification
- **Quick Processing**: Admin approval system

### Leaderboard & Competition
- **Global Rankings**: Compete with all users
- **Top Earners Widget**: Homepage displays top 5
- **Medal System**: 🥇🥈🥉 for top performers
- **Motivation**: Encourages quality submissions

### Invite Tracking
- **Reward System**: Track successful invites
- **Fake Detection**: Filters suspicious accounts
- **Leaderboard**: Top inviters recognition
- **Account Age Check**: Validates genuine invites

### Security Features
- **Nuke Protection**: Emergency server lockdown
- **Fraud Detection**: Identifies fake invites
- **Rate Limiting**: Prevents spam and abuse
- **Role-based Permissions**: Granular access control
- **Audit Logs**: All actions logged to channels

---

## 📊 Campaign Types

1. **Clipping Campaigns**
   - Create clips from existing content
   - Earn based on views
   - Platform-specific requirements

2. **Reposting Campaigns**
   - Share existing content
   - Cross-platform promotion
   - CPM-based earnings

3. **UGC Campaigns**
   - Create original content
   - Higher rates
   - Quality requirements

---

## 💰 Earnings Calculation

**Formula**: `Earnings = (Views / 1000) × Rate per 1K views`

**Example**:
- Video has 50,000 views
- Campaign rate: $5 per 1K views
- Earnings: (50,000 / 1000) × $5 = **$250**

**Budget Tracking**:
- Campaign budget: $1,000
- Current spending: $750 (75% used)
- Remaining: $250 (25% left)
- Auto-pauses at 100%

---

## 🔔 Notification Channels

All major actions are logged to specific channels:

- **SUBMISSION_LOGS_CHANNEL**: Clip submissions and approvals
- **FLAGGED_CLIPS_CHANNEL**: Flagged suspicious clips
- **PAYOUT_LOGS_CHANNEL**: Payout requests and processing
- **MODERATION_LOGS_CHANNEL**: Bans, kicks, warnings
- **COMMAND_LOGS_CHANNEL**: Admin command usage
- **ERROR_LOGS_CHANNEL**: System errors and issues
- **MEMBER_LOGS_CHANNEL**: Joins, leaves, account links
- **WELCOME_CHANNEL**: New member greetings
- **ANNOUNCEMENTS_CHANNEL**: Platform announcements
- **SUPPORT_CHANNEL**: Support tickets and help

---

## 🎮 Usage Tips

### For Users
1. **Link Multiple Accounts**: Take advantage of multi-account support
2. **Build Streaks**: Submit daily to earn streak badges
3. **Track Progress**: Use `/quickstats` for quick overview
4. **Check Achievements**: See what milestones you're close to unlocking
5. **Compete**: Aim for leaderboard top spots

### For Admins
1. **Use `/listaccounts`**: Before verifying, check user's Account IDs
2. **Track Budget**: Monitor campaign spending with `/stats`
3. **Quick Approvals**: Use `/approveclip` with current view count
4. **Manual Updates**: Use `/updateviews` for API failures
5. **Export Data**: Regular backups with `/exportdata`

---

## 🚀 Quick Start Guide

### For New Users
1. Join server and verify in #welcome
2. Use `/linkaccount` to connect your social media
3. Use `/verifyaccount` to verify ownership
4. Browse campaigns with `/campaigns`
5. Submit clips with `/submit`
6. Check earnings with `/quickstats`
7. Request payout when ready with `/requestpayout`

### For Admins
1. Create campaign with `/addcampaign`
2. Monitor submissions in logs channels
3. Approve clips with `/approveclip`
4. Use `/listaccounts` to check user accounts before verification
5. Process payouts with `/approvepayout`
6. Export data regularly with `/exportdata`

---

## 📞 Support

For issues or questions:
- Use `/feedback` command
- Create ticket in support channel
- Contact server admins

---

**Last Updated**: October 23, 2025
**Bot Version**: 2.0 (Multi-Account & Achievements Update)
**Total Commands**: 68
