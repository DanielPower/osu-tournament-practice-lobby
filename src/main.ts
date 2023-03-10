import * as db from "zapatos/db";
import type * as s from "zapatos/schema";
import pool from "./pool.js";
import { Interaction, REST, Routes, Client, GatewayIntentBits } from "discord.js";
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
  {
    name: "whoami",
    description: "Identify your user",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.DISCORD_ID!), {
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
  if (!interaction.isChatInputCommand()) {
    return;
  }

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
        `&redirect_uri=${process.env.BASE_URL}/auth` +
        `&response_type=code` +
        `) to authenticate your osu! profile`,
    });
  }
  if (interaction.commandName === "whoami") {
    const users = await db.sql<
      s.users.SQL,
      s.users.Selectable[]
    >`SELECT ${"osu_id"} FROM ${"users"} WHERE ${"discord_id"} = ${db.param(
      interaction.user.id,
    )};`.run(pool);

    if (!users.length) {
      await interaction.reply(
        "Your osu! account is not linked.\nPlease use the /auth command",
      );
      return;
    }
    await interaction.reply(
      `Discord ID: ${interaction.user.id}\nosu! ID: ${users[0].osu_id}`,
    );
  }
});

await client.login(process.env.DISCORD_TOKEN);
