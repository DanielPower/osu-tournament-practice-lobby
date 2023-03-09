import { Interaction } from "discord.js";
import { REST, Routes } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "auth",
    description: "Link with your osu! account",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (interaction.commandName === "auth") {
    await interaction.reply({
      ephemeral: true,
      content:
        "[Click here](" +
        "https://osu.ppy.sh/oauth/authorize" +
        `?client_id=${process.env.OSU_CLIENT_ID}` +
        `&state=${interaction.user.id}` +
        `&redirect_uri=${process.env.AUTH_URL}` +
        `&response_type=code` +
        `) to authenticate your osu! profile`,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
