const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../../database/init');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verifyaccount')
    .setDescription('Submit your account for verification')
    .addStringOption(option =>
      option.setName('platform')
        .setDescription('Platform to verify')
        .setRequired(true)
        .addChoices(
          { name: 'YouTube', value: 'YouTube' },
          { name: 'TikTok', value: 'TikTok' },
          { name: 'Instagram', value: 'Instagram' }
        ))
    .addIntegerOption(option =>
      option.setName('account_id')
        .setDescription('Account ID to verify (optional, use if you have multiple accounts)')
        .setRequired(false)),

  async execute(interaction) {
    const platform = interaction.options.getString('platform');
    const accountId = interaction.options.getInteger('account_id');
    const userId = interaction.user.id;

    await interaction.deferReply({ ephemeral: true });

    try {
      const { verifyAccountCode } = require('../../services/verification');
      
      let account = null;

      if (accountId) {
        account = db.prepare(`
          SELECT * FROM social_accounts 
          WHERE id = ? AND user_id = ? AND platform = ?
        `).get(accountId, userId, platform);

        if (!account) {
          const userAccounts = db.prepare(`
            SELECT id, platform, account_handle, verification_status 
            FROM social_accounts 
            WHERE user_id = ? AND platform = ?
            ORDER BY created_at DESC
          `).all(userId, platform);

          if (userAccounts.length === 0) {
            return await interaction.editReply({
              embeds: [errorEmbed('Not Found', `No ${platform} account linked. Use \`/linkaccount\` first.`)]
            });
          }

          const accountsList = userAccounts.map(acc => 
            `**ID ${acc.id}:** ${acc.account_handle} (${acc.verification_status})`
          ).join('\n');

          return await interaction.editReply({
            embeds: [errorEmbed('Invalid Account ID', `Account ID ${accountId} not found.\n\n**Your ${platform} accounts:**\n${accountsList}\n\nUse \`/verifyaccount platform:${platform} account_id:<ID>\` with the correct ID.`)]
          });
        }
      } else {
        const accounts = db.prepare(`
          SELECT * FROM social_accounts 
          WHERE user_id = ? AND platform = ?
          ORDER BY created_at DESC
        `).all(userId, platform);

        if (!accounts || accounts.length === 0) {
          return await interaction.editReply({
            embeds: [errorEmbed('Not Found', `No ${platform} account linked. Use \`/linkaccount\` first.`)]
          });
        }

        const unverifiedAccounts = accounts.filter(acc => acc.verification_status !== 'verified');
        
        if (unverifiedAccounts.length === 0) {
          return await interaction.editReply({
            embeds: [successEmbed('All Verified', `All your ${platform} accounts are already verified! ✅\n\nUse \`/myaccounts\` to see all your linked accounts.`)]
          });
        }

        if (unverifiedAccounts.length > 1) {
          const accountsList = unverifiedAccounts.map(acc => 
            `**ID ${acc.id}:** ${acc.account_handle}\n   Code: \`${acc.verification_code}\``
          ).join('\n\n');
          
          return await interaction.editReply({
            embeds: [errorEmbed(
              'Multiple Accounts Found',
              `You have ${unverifiedAccounts.length} unverified ${platform} accounts. Please specify which one to verify:\n\n${accountsList}\n\nUse \`/verifyaccount platform:${platform} account_id:<ID>\` to verify a specific account.`
            )]
          });
        }

        account = unverifiedAccounts[0];
      }

      if (account.verification_status === 'verified') {
        return await interaction.editReply({
          embeds: [successEmbed('Already Verified', `This ${platform} account is already verified! ✅`)]
        });
      }

      await interaction.editReply({
        embeds: [successEmbed('Checking...', `🔍 Checking your ${platform} bio for verification code \`${account.verification_code}\`...\n\n**Account:** ${account.account_handle}\n**Account ID:** ${account.id}\n\nThis may take a few seconds.`)]
      });

      const result = await verifyAccountCode(
        account.platform, 
        account.account_url, 
        account.verification_code,
        userId,
        account.account_handle,
        interaction.client
      );

      if (result.verified) {
        const stmt = db.prepare(`
          UPDATE social_accounts 
          SET verification_status = 'verified', verified_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        stmt.run(account.id);

        await interaction.editReply({
          embeds: [successEmbed(
            '✅ Verification Successful!',
            `Your ${platform} account has been automatically verified!\n\n**Account ID:** ${account.id}\n**Handle:** ${account.account_handle}\n**Status:** Verified ✅\n\n🎉 Your verified badge is now live on your dashboard!`
          )]
        });
      } else if (result.ticketCreated) {
        await interaction.editReply({
          embeds: [successEmbed(
            '🎫 Ticket Created',
            `Automatic verification couldn't complete.\n\n**Ticket #${result.ticketId}** has been created for manual review!\n\n**Account ID:** ${account.id}\n**Platform:** ${platform}\n**Handle:** ${account.account_handle}\n**Code:** \`${account.verification_code}\`\n\n⏰ An admin will verify your account manually within 24 hours. You'll be notified once approved!`
          )]
        });
      } else {
        await interaction.editReply({
          embeds: [errorEmbed(
            '❌ Verification Failed',
            `Could not find the verification code in your ${platform} bio.\n\n**Account ID:** ${account.id}\n**Reason:** ${result.reason}\n\n**Your Code:** \`${account.verification_code}\`\n\n**Please:**\n1. Make sure the code is in your bio/description\n2. Wait a few minutes for changes to sync\n3. Try again with \`/verifyaccount ${platform.toLowerCase()}\``
          )]
        });
      }

    } catch (error) {
      console.error('Verify account error:', error);
      await interaction.editReply({
        embeds: [errorEmbed('Error', 'Failed to verify account. Please try again later.')]
      });
    }
  }
};
