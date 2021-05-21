import Command from "../../command/Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";
import CommandActionExecutor from "../../command/CommandActionExecutor";
import TagProvider from "../../provider/TagProvider";


export default class TagCommand extends Command{

    constructor() {
        super("tag", "Einen Tag in den Channel senden", true);
        this.withParameter("name", "Name des Tags", CommandParameterType.STRING, true)
    }

    async executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        await executor.sendThinking()
        const name: string = args.getArgument("name").getAsString();

        const result = await this.getTag(member, name)
        await executor.sendWebhookMessage(result)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        if (args.length < 1) return message.channel.send("Nutze `tag <name>`")
        const name = args[0];

        const result = await this.getTag(member, name)
        await message.channel.send(result);
    }

    async getTag(member: GuildMember, name: string) : Promise<string>{
        if (name.includes(" ")) return "Der Tag-Name kann keine Leerzeichen enthalten"
        const tag = await TagProvider.getTag(name);
        if (!tag) return "Der Tag existiert nicht"
        return tag.content
    }

}