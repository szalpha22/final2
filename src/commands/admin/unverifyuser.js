const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { db } = require('../../database/init');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unverifyuser')
    .setDescription('Remove verification from a user\'s social media account')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to unverify')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('account_id')
        .setDescription('Account ID to unverify (use /myaccounts to see IDs)')
        .setRequired(true)),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const accountId = interaction.options.getInteger('account_id');

    await interaction.deferReply({ ephemeral: true });

    try {
      const account = db.prepare(`
        SELECT * FROM social_accounts 
        WHERE id = ? AND user_id = ?
      `).get(accountId, targetUser.id);

      if (!account) {
        const userAccounts = db.prepare(`
          SELECT id, platform, account_handle, verification_status 
          FROM social_accounts 
          WHERE user_id = ?
          ORDER BY created_at DESC
        `).all(targetUser.id);

        if (userAccounts.length === 0) {
          return await interaction.editReply({
            embeds: [errorEmbed('Not Found', `${targetUser.username} doesn't have any linked accounts.`)]
          });
        }

        const accountsList = userAccounts.map(acc => 
          `**ID ${acc.id}:** ${acc.platform} - ${acc.account_handle} (${acc.verification_status})`
        ).join('\n');

        return await interaction.editReply({
          embeds: [errorEmbed('Invalid Account ID', `Account ID ${accountId} not found for ${targetUser.username}.\n\n**Their accounts:**\n${accountsList}`)]
        });
      }

      const stmt = db.prepare(`
        UPDATE social_accounts 
        SET verification_status = 'pending', verified_at = NULL
        WHERE id = ?
      `);
      stmt.run(accountId);

      const { logToChannel } = require('../../utils/logger');
      await logToChannel(interaction.client, 'MEMBER_LOGS_CHANNEL', {
        title: '❌ Account Unverified',
        description: `Admin removed verification from a user's account`,
        fields: [
          { name: 'User', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
          { name: 'Account ID', value: `${accountId}`, inline: true },
          { name: 'Admin', value: `${interaction.user.tag}`, inline: true },
          { name: 'Platform', value: account.platform, inline: true },
          { name: 'Handle', value: account.account_handle, inline: true },
          { name: 'URL', value: account.account_url, inline: false }
        ],
        color: 0xff0000
      });

      await interaction.editReply({
        embeds: [successEmbed(
          '❌ Verification Removed',
          `Removed verification from ${targetUser.username}'s account.\n\n**Account ID:** ${accountId}\n**Platform:** ${account.platform}\n**Handle:** ${account.account_handle}\n**URL:** ${account.account_url}`
        )]
      });

    } catch (error) {
      console.error('Unverify user error:', error);
      await interaction.editReply({
        embeds: [errorEmbed('Error', 'Failed to unverify account.')]
      });
    }
  }
};
