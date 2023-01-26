// licensed under GPL 3.0 by sollee
// the BEGONE SCAMMER bot
// made for trustless

require("dotenv").config();
const { search } = require("homoglyph-search");
const { Client, Events, GatewayIntentBits } = require("discord.js");

const CHANNEL_ID = "1068256026664632343";

const badWords = [
  "admin",
  "support",
  "help",
  "operator",
  "giveaway",
  "finance",
  "trading",
  "community",
  "official",
  "announcement",
  "news",
  "dao",
  "robot",
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

function normalizeStr(str) {
  return str
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

client.once(Events.ClientReady, (c) => {
  console.log(`Meowzers, up and running bois - ${c.user.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  //  rat peeps out of little hidey hole?
  //                 MEOW.
  // ..and it gets smacked with the hammer

  console.log("guild member added");

  let str = normalizeStr(member.user.username);
  let badnessPoints = 0;
  let testsFailed = [];

  if (member.user.createdTimestamp + 7 * 24 * 60 * 1000 > Date.now()) {
    ++badnessPoints;
    testsFailed.push("User age below 1 week");
  }
  if (search(str, ["trustless"]).length > 0) {
    badnessPoints += 2;
    testsFailed.push("Contains the word Trustless");
  }
  if (search(str, badWords).length > 0) {
    ++badnessPoints;
    testsFailed.push("Contains a suspicious word");
  }

  // pass verdict

  let message = [
    `**MEOW!** <@${member.user.id}> (${member.user.username}#${member.user.discriminator})`,
    `- failed test(s): ${testsFailed.join(", ")}`,
    `- \`${badnessPoints}\` sus points`,
  ].join("\n");

  if (badnessPoints >= 1) {
    const channel = await member.guild.channels.fetch(CHANNEL_ID);
    if (badnessPoints >= 3) {
      await channel.send(message.concat("\n**CATTO VERDICT**: Guilty."));

      // bring down the hammer
      if (member.bannable) {
        await member.ban({ reason: "scammer scammer scammer" });
        console.log("banned");
      }
    } else {
      await channel.send(message.concat("\n**catto ask review pls**"));
      console.log("pls review");
    }
  }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
