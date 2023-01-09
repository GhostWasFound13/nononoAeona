const Logging = require("../../database/schemas/logging");
const discord = require("discord.js");

module.exports = {
  name: "roleDelete",
  async execute(client, role) {
    if (!role) return;
    if (role.managed) return;
    const logging = await Logging.findOne({ guildId: role.guild.id });

    if (logging) {
      if (logging.server_events.toggle == "true") {
        const channelEmbed = await role.guild.channels.cache.get(
          logging.server_events.channel
        );

        if (channelEmbed) {
          let color = logging.server_events.color;
          if (color == "#000000") color = "RED";

          if (logging.server_events.role_create == "true") {
            const embed = new discord.MessageEmbed()
              .setDescription(`🗑️ ***Role Deleted***`)
              .addField("Role Name", role.name, true)
              .setFooter({ text: `Role ID: ${role.id}` })
              .setTimestamp()
              .setColor(color);

            if (
              channelEmbed &&
              channelEmbed.viewable &&
              channelEmbed
                .permissionsFor(role.guild.me)
                .has(["SEND_MESSAGES", "EMBED_LINKS"])
            ) {
              channelEmbed.send({ embeds: [embed] }).catch(() => {});
            }
          }
        }
      }
    }
  },
};
