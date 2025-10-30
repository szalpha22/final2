const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db } = require('../../database/init');
const { COLORS } = require('../../utils/embeds');

function checkAchievements(userId) {
  const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
  
  const stats = db.prepare(`
    SELECT 
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_clips,
      SUM(CASE WHEN status = 'approved' THEN views ELSE 0 END) as total_views
    FROM submissions WHERE user_id = ?
  `).get(userId);
  
  const payoutStats = db.prepare(`
    SELECT 
      SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_paid
    FROM payouts WHERE user_id = ?
  `).get(userId);

  const totalEarned = (user?.balance || 0) + (payoutStats?.total_paid || 0);
  const approvedClips = stats?.approved_clips || 0;
  const totalViews = stats?.total_views || 0;

  const achievements = [
    {
      id: 'first_clip',
      name: '🎬 First Steps',
      description: 'Submit your first clip',
      unlocked: approvedClips >= 1,
      progress: Math.min(approvedClips, 1),
      max: 1
    },
    {
      id: '10_clips',
      name: '📹 Rising Star',
      description: 'Get 10 clips approved',
      unlocked: approvedClips >= 10,
      progress: Math.min(approvedClips, 10),
      max: 10
    },
    {
      id: '50_clips',
      name: '🌟 Content Creator',
      description: 'Get 50 clips approved',
      unlocked: approvedClips >= 50,
      progress: Math.min(approvedClips, 50),
      max: 50
    },
    {
      id: '100_clips',
      name: '👑 Clip Master',
      description: 'Get 100 clips approved',
      unlocked: approvedClips >= 100,
      progress: Math.min(approvedClips, 100),
      max: 100
    },
    {
      id: 'first_dollar',
      name: '💵 First Earnings',
      description: 'Earn your first dollar',
      unlocked: totalEarned >= 1,
      progress: Math.min(totalEarned, 1),
      max: 1
    },
    {
      id: '100_earned',
      name: '💰 Hundred Club',
      description: 'Earn $100',
      unlocked: totalEarned >= 100,
      progress: Math.min(totalEarned, 100),
      max: 100
    },
    {
      id: '1000_earned',
      name: '🏆 Thousand Club',
      description: 'Earn $1,000',
      unlocked: totalEarned >= 1000,
      progress: Math.min(totalEarned, 1000),
      max: 1000
    },
    {
      id: '10k_views',
      name: '👁️ 10K Views',
      description: 'Reach 10,000 total views',
      unlocked: totalViews >= 10000,
      progress: Math.min(totalViews, 10000),
      max: 10000
    },
    {
      id: '100k_views',
      name: '🌐 100K Views',
      description: 'Reach 100,000 total views',
      unlocked: totalViews >= 100000,
      progress: Math.min(totalViews, 100000),
      max: 100000
    },
    {
      id: '1m_views',
      name: '🚀 Million Views',
      description: 'Reach 1,000,000 total views',
      unlocked: totalViews >= 1000000,
      progress: Math.min(totalViews, 1000000),
      max: 1000000
    }
  ];

  return achievements;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('achievements')
    .setDescription('View your unlocked achievements and progress'),

  async execute(interaction) {
    const userId = interaction.user.id;

    await interaction.deferReply({ ephemeral: true });

    try {
      const achievements = checkAchievements(userId);
      const unlockedCount = achievements.filter(a => a.unlocked).length;
      const totalCount = achievements.length;

      const embed = new EmbedBuilder()
        .setTitle(`🏆 Achievements - ${interaction.user.username}`)
        .setDescription(`**Unlocked:** ${unlockedCount}/${totalCount} (${Math.round((unlockedCount/totalCount)*100)}%)`)
        .setColor(COLORS.SUCCESS)
        .setThumbnail(interaction.user.displayAvatarURL());

      const unlockedAchievements = achievements.filter(a => a.unlocked);
      const lockedAchievements = achievements.filter(a => !a.unlocked);

      if (unlockedAchievements.length > 0) {
        const unlockedText = unlockedAchievements.map(a => 
          `${a.name}\n*${a.description}*`
        ).join('\n\n');
        
        embed.addFields({
          name: '✅ Unlocked',
          value: unlockedText,
          inline: false
        });
      }

      if (lockedAchievements.length > 0) {
        const lockedText = lockedAchievements.slice(0, 5).map(a => {
          const percent = Math.round((a.progress / a.max) * 100);
          const progressBar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));
          return `🔒 **${a.name}**\n*${a.description}*\n${progressBar} ${percent}%`;
        }).join('\n\n');
        
        embed.addFields({
          name: '🔒 Locked (In Progress)',
          value: lockedText,
          inline: false
        });
      }

      embed.setFooter({ text: `Keep grinding to unlock all ${totalCount} achievements!` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Achievements error:', error);
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Failed to fetch achievements.')
        .setColor(COLORS.ERROR);
      await interaction.editReply({ embeds: [embed] });
    }
  }
};
