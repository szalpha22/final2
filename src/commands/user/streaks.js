const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db } = require('../../database/init');
const { COLORS } = require('../../utils/embeds');

function calculateStreak(userId) {
  const submissions = db.prepare(`
    SELECT DATE(submitted_at) as date
    FROM submissions
    WHERE user_id = ? AND status = 'approved'
    ORDER BY submitted_at DESC
  `).all(userId);

  if (!submissions || submissions.length === 0) {
    return { current: 0, longest: 0, lastSubmission: null };
  }

  let currentStreak = 0;
  let longestStreak = 1;
  let tempStreak = 1;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastDate = new Date(submissions[0].date);
  lastDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0 || daysDiff === 1) {
    currentStreak = 1;
    
    for (let i = 1; i < submissions.length; i++) {
      const currentDate = new Date(submissions[i-1].date);
      const prevDate = new Date(submissions[i].date);
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  tempStreak = 1;
  for (let i = 1; i < submissions.length; i++) {
    const currentDate = new Date(submissions[i-1].date);
    const prevDate = new Date(submissions[i].date);
    currentDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);
    
    const diff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, currentStreak);

  return { 
    current: currentStreak, 
    longest: longestStreak,
    lastSubmission: submissions[0].date 
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streaks')
    .setDescription('View your submission streak'),

  async execute(interaction) {
    const userId = interaction.user.id;

    await interaction.deferReply({ ephemeral: true });

    try {
      const { current, longest, lastSubmission } = calculateStreak(userId);

      const streakEmoji = current >= 7 ? '🔥' : current >= 3 ? '⚡' : '📅';
      const streakMessage = current === 0 
        ? 'No active streak. Submit a clip to start one!' 
        : current === 1 
        ? 'Great start! Submit tomorrow to continue your streak!' 
        : current >= 30 
        ? '🌟 Legendary streak! You\'re unstoppable!' 
        : current >= 14 
        ? '🔥 You\'re on fire! Keep it going!' 
        : current >= 7 
        ? '💪 One week strong! Amazing dedication!' 
        : '⚡ Nice streak! Keep the momentum!';

      const embed = new EmbedBuilder()
        .setTitle(`${streakEmoji} Submission Streak`)
        .setDescription(streakMessage)
        .setColor(current >= 7 ? 0xFF4500 : current >= 3 ? 0xFFD700 : COLORS.INFO)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields([
          {
            name: '🔥 Current Streak',
            value: `**${current} day${current !== 1 ? 's' : ''}**`,
            inline: true
          },
          {
            name: '🏆 Longest Streak',
            value: `**${longest} day${longest !== 1 ? 's' : ''}**`,
            inline: true
          },
          {
            name: '📅 Last Submission',
            value: lastSubmission ? new Date(lastSubmission).toLocaleDateString() : 'Never',
            inline: true
          }
        ]);

      if (current > 0) {
        const rewards = [];
        if (current >= 7) rewards.push('✅ 7-Day Warrior');
        if (current >= 14) rewards.push('✅ 2-Week Champion');
        if (current >= 30) rewards.push('✅ Monthly Legend');
        
        if (rewards.length > 0) {
          embed.addFields({
            name: '🎖️ Streak Milestones',
            value: rewards.join('\n'),
            inline: false
          });
        }
      }

      embed.setFooter({ text: 'Submit daily to build your streak!' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Streaks error:', error);
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Failed to fetch your streak data.')
        .setColor(COLORS.ERROR);
      await interaction.editReply({ embeds: [embed] });
    }
  }
};
