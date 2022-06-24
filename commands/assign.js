const Task = require("../models/Task");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
		.setName('assign')
		.setDescription('Assigns task')
    .addStringOption(option => option.setName('taskid').setDescription('Enter the task ID'))
    .addUserOption(option => option.setName('target').setDescription('User who needs to do the task')),
  async execute(client, interaction) {
    try {

      const taskId = interaction.options.getString("taskid");
      const channelId = interaction.channel.id;

      if (!taskId) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Error")
          .setDescription(
            "You need to enter the id of the task to tick it off\n"
          );
          interaction.deferReply();
          return client.channels.cache.get(channelId).send({embeds: [errorEmbed]});
      }

      // Get Tagged User (first) to assign
      const taggedUser = interaction.options.getUser("target");
      if (!taggedUser) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Error")
          .setDescription(
            "You need to mention a user to assign them to the task"
          );
          interaction.deferReply();
          return client.channels.cache.get(channelId).send({embeds: [errorEmbed]});
      }

      const taggedUserId = taggedUser.id;

      const task = await Task.findByPk(taskId);

      if (!task) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Error")
          .setDescription("Task does not exist");
          interaction.deferReply();
          return client.channels.cache.get(channelId).send({embeds: [errorEmbed]});
      }

      if (task.serverId !== interaction.guild.id) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Error")
          .setDescription(
            "You can only tick off a task from the current server"
          );
          interaction.deferReply();
          return client.channels.cache.get(channelId).send({embeds: [errorEmbed]});
      }

      await Task.update(
        { assignTo: taggedUserId },
        {
          where: {
            id: taskId,
          },
        }
      );

      const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Assigned")
        .setDescription('Task: '+task.text+'\n Assigned successfully to :' + taggedUser.username);
        interaction.reply("Task Assigned successfully!")
        return client.channels.cache.get(channelId).send({embeds: [embed]});
    } catch (error) {
      console.error(error.toString());
      return interaction.reply("Couldn't assign task");
    }
  },
};