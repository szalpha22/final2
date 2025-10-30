const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db } = require('../../database/init');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quickstats')
    .setDescription('Quick overview of your earnings and stats'),

  async execute(interaction) {
    const userId = interaction.user.id;

    await interaction.deferReply({ ephemeral: true });

    try {
      const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
      
      const stats = db.prepare(`
        SELECT 
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_clips,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_clips,
          SUM(CASE WHEN status = 'approved' THEN views ELSE 0 END) as total_views,
          COUNT(*) as total_submissions
        FROM submissions WHERE user_id = ?
      `).get(userId);
      
      const payoutStats = db.prepare(`
        SELECT 
          SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_paid,
          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
        FROM payouts WHERE user_id = ?
      `).get(userId);

      const topClip = db.prepare(`
        SELECT campaign_id, views, video_link
        FROM submissions
        WHERE user_id = ? AND status = 'approved'
        ORDER BY views DESC
        LIMIT 1
      `).get(userId);

      const balance = user?.balance || 0;
      const totalPaid = payoutStats?.total_paid || 0;
      const lifetime = balance + totalPaid;

      const embed = new EmbedBuilder()
        .setTitle(`⚡ Quick Stats - ${interaction.user.username}`)
        .setColor(COLORS.SUCCESS)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields([
          {
            name: '💰 Earnings',
            value: `**Balance:** $${balance.toFixed(2)}\n**Total Paid:** $${totalPaid.toFixed(2)}\n**Lifetime:** $${lifetime.toFixed(2)}`,
            inline: true
          },
          {
            name: '📊 Submissions',
            value: `**Approved:** ${stats?.approved_clips || 0}\n**Pending:** ${stats?.pending_clips || 0}\n**Total:** ${stats?.total_submissions || 0}`,
            inline: true
          },
          {
            name: '👁️ Views',
            value: `**Total:** ${(stats?.total_views || 0).toLocaleString()}\n**Per Clip:** ${stats?.approved_clips > 0 ? Math.round((stats?.total_views || 0) / stats.approved_clips).toLocaleString() : '0'}`,
            inline: true
          }
        ]);

      if (payoutStats?.pending_amount > 0) {
        embed.addFields({
          name: '⏳ Pending Payouts',
          value: `${payoutStats.pending_count} request(s) - $${payoutStats.pending_amount.toFixed(2)}`,
          inline: false
        });
      }

      if (topClip) {
        embed.addFields({
          name: '🏆 Top Performing Clip',
          value: `**Views:** ${topClip.views.toLocaleString()}\n[View Clip](${topClip.video_link})`,
          inline: false
        });
      }

      embed.setFooter({ text: 'Use /mystats for detailed analytics' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Quick stats error:', error);
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Failed to fetch your stats.')
        .setColor(COLORS.ERROR);
      await interaction.editReply({ embeds: [embed] });
    }
  }
};
