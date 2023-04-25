const { join } = require("path");
const fs = require("fs");

const LoadCommands = () => {
	return new Promise(async (resolve) => {
		let slash = await LoadDirectory("slash");
		let context = await LoadDirectory("context");
		let normal = await LoadDirectory("normal")
		
		resolve({ slash, context, normal });
	});
};

const LoadDirectory = (dir) => {
	return new Promise((resolve) => {
		let commands = [];
		let CommandsDir = join(__dirname, "..", "commands", dir);
		
		fs.readdir(CommandsDir, (err, files) => {
			if (err) {
				throw err;
			}
			
			for (const file of files) {
				let cmd = require(CommandsDir + "/" + file);
				if (!cmd || (dir == "context" && !cmd.command)) {
					return console.log(
						"Unable to load Command: " +
						file.split(".")[0] +
						", File doesn't have either command",
					);
				}
				if (dir == "context") {
					commands.push(cmd.command);
				} else if (dir == "normal") {
					commands.push(cmd);
				} else { 
					commands.push(cmd);
				}
			}
			;
			resolve(commands);
		});
	});
};

module.exports = LoadCommands;
