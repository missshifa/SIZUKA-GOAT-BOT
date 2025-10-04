module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmd"],
    version: "5.0",
    author: "𝐒𝐇𝐈𝐅𝐀𝐓", //PLZ DON'T CHANGE MY CREDIT 🙏
    shortDescription: "Show all available commands in styled list.",
    longDescription: "Displays a clean and premium-styled categorized list of commands.",
    category: "system",
    guide: "{pn}help [command name]"
  },

  onStart: async function ({ message, args, prefix }) {
    const allCommands = global.GoatBot.commands;
    const categories = {};

    const cleanCategoryName = (text) => {
      if (!text) return "OTHERS";
      return text
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();
    };

    for (const [name, cmd] of allCommands) {
      if (!cmd?.config || cmd.config.name === "help") continue;
      const cat = cleanCategoryName(cmd.config.category);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    }

    // --- If specific command is queried ---
    if (args[0]) {
      const query = args[0].toLowerCase();
      const cmd =
        allCommands.get(query) ||
        [...allCommands.values()].find((c) => (c.config.aliases || []).includes(query));

      if (!cmd) {
        return message.reply(`❌ Command "${query}" not found.`);
      }

      const { name, version, author, guide, category, shortDescription, longDescription, aliases } = cmd.config;
      const desc = longDescription || shortDescription || "No description provided.";
      const usage = (guide || "{pn}{name}").replace(/{pn}/g, prefix);

      const replyMsg =
        `╭─ ✨ Command Details\n` +
        `│\n` +
        `│ 𝗡𝗮𝗺𝗲: ${name}\n` +
        `│ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${category || "Uncategorized"}\n` +
        `│ 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${aliases?.length ? aliases.join(", ") : "None"}\n` +
        `│ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${version || "1.0"}\n` +
        `│ 𝗔𝘂𝘁𝗵𝗼𝗿: ${author || "Unknown"}\n` +
        `│\n` +
        `│ 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${desc}\n` +
        `│ 𝗨𝘀𝗮𝗴𝗲: ${usage}\n` +
        `│\n` +
        `╰────────────➤`;

      return message.reply(replyMsg);
    }

    // --- Full help menu (no video) ---
    let msg = "╭───────❉\n│ 𝐊𝐀𝐊𝐀𝐒𝐇𝐈 𝐂𝐌𝐃 𝐋𝐈𝐒𝐓\n╰────────────❉\n\n";
    const sortedCategories = Object.keys(categories).sort();

    for (const cat of sortedCategories) {
      if (categories[cat].length === 0) continue;

      msg += `╭─────✦『 ${cat} 』\n`;
      const commands = categories[cat].sort();
      for (let i = 0; i < commands.length; i += 2) {
        const cmd1 = commands[i];
        const cmd2 = commands[i + 1];
        if (cmd2) {
          msg += `│✿${cmd1} ✿${cmd2}\n`;
        } else {
          msg += `│✿${cmd1}\n`;
        }
      }
      msg += `╰────────────✦\n\n`;
    }

    const totalCommands = allCommands.size - 1;
    msg +=
      `╭─────✦[𝗘𝗡𝗝𝗢𝗬]\n` +
      `│>𝗧𝗢𝗧𝗔𝗟 𝗖𝗠𝗗𝗦: [${totalCommands}].\n` +
      `│𝗧𝗬𝗣𝗘:[ ${prefix}help <command> ]\n` +
      `╰────────────✦\n\n` +
      `╭─────✦✦\n` +
      `│ ╣𝐒𝐇𝐈𝐅𝐀𝐓 ꨄ︎╠\n` +
      `╰───────────✦✦`;

    return message.reply(msg);
  }
};
