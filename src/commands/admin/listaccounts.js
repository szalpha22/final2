const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { db } = require('../../database/init');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listaccounts')
    .setDescription('View all linked accounts for a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User whose accounts to view')
        .setRequired(true)),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    try {
      const accounts = db.prepare(`
        SELECT * FROM social_accounts 
        WHERE user_id = ? 
        ORDER BY platform ASC, created_at DESC
      `).all(targetUser.id);

      if (!accounts || accounts.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle(`🔗 ${targetUser.username}'s Linked Accounts`)
          .setDescription('This user hasn\'t linked any accounts yet.')
          .setColor(COLORS.INFO)
          .setThumbnail(targetUser.displayAvatarURL());

        return await interaction.editReply({ embeds: [embed] });
      }

      const statusEmojis = {
        'verified': '✅ Verified',
        'pending_review': '⏳ Pending Review',
        'pending': '⚠️ Not Submitted',
        'rejected': '❌ Rejected'
      };

      const fields = accounts.map(account => ({
        name: `${account.platform === 'YouTube' ? '📺' : account.platform === 'TikTok' ? '🎵' : '📸'} ${account.platform} (ID: ${account.id})`,
        value: `**Handle:** ${account.account_handle}\n**Status:** ${statusEmojis[account.verification_status] || account.verification_status}\n**URL:** ${account.account_url}\n**Linked:** <t:${Math.floor(new Date(account.created_at).getTime() / 1000)}:R>${account.verification_status === 'pending' ? `\n**Code:** \`${account.verification_code}\`` : ''}${account.verified_at ? `\n**Verified:** <t:${Math.floor(new Date(account.verified_at).getTime() / 1000)}:R>` : ''}`,
        inline: false
      }));

      const verifiedCount = accounts.filter(a => a.verification_status === 'verified').length;

      const embed = new EmbedBuilder()
        .setTitle(`🔗 ${targetUser.username}'s Linked Accounts`)
        .setDescription(`**Total Accounts:** ${accounts.length}\n**Verified:** ${verifiedCount}\n**Pending:** ${accounts.length - verifiedCount}\n\nℹ️ Use \`/verifyuser @${targetUser.username} account_id:<ID>\` to verify an account.`)
        .addFields(fields)
        .setColor(COLORS.SUCCESS)
        .setThumbnail(targetUser.displayAvatarURL())
        .setFooter({ text: `User ID: ${targetUser.id}` });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('List accounts error:', error);
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Failed to fetch user accounts.')
        .setColor(COLORS.ERROR);
      await interaction.editReply({ embeds: [embed] });
    }
  }
};
