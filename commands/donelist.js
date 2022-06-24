const Task = require("../models/Task");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  data: new SlashCommandBuilder()
		.setName('donelist')
		.setDescription('Lists done tasks'),
  async execute(client, interaction) {
    try {
        const channelId = interaction.channel.id;
        const tasks = await Task.findAll({
            where: {
              archive: false,
              isDone: true,
              serverId: interaction.guild.id,
            },
            attributes: ["id", "text", "assignTo", "updatedAt"],
          });

          let messageContent = tasks
            .map((task, idx) => {
              if (task.assignTo) {
                return `${idx + 1}. ${task.text} - <@${task.assignTo}> - Task id:${
                  task.id} Task completed: ${moment( task.dateCreated).format("dddd MMMM Do YYYY, h:mm a")}\n`;
              } else {
                return `${idx + 1}. ${task.text} - ${task.id}\n`;
              }
            })
            .join("");
      
          const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Task List (Done)")
            .setDescription(
              messageContent
            );
      
            interaction.reply("Listed done tasks successfully!")
            return client.channels.cache.get(channelId).send({embeds: [embed]});
    }catch (error) {
        console.error(error.toString());
        return interaction.reply("Couldn't list tasks");
      }
  },
};