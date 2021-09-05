import {
    ApplicationCommand,
    ApplicationCommandData,
    ApplicationCommandPermissionData,
    CommandInteraction,
    GuildMember,
    Snowflake
} from "discord.js";
import PermissionsUtil from "../../utils/PermissionsUtil";
import {SlashCommandBuilder} from "@discordjs/builders";

export default abstract class SlashCommand {
    readonly permittedRoles: Snowflake[] = []
    protected builder: SlashCommandBuilder;

    protected constructor(readonly name: string, description: string) {
        this.builder = new SlashCommandBuilder().setName(name).setDescription(description);
    }

    build(): ApplicationCommandData {
        // @ts-ignore
        return {
            ...this.builder.toJSON(),
            defaultPermission: this.permittedRoles.length == 0
        }
    }


    async registerPermissions(command: ApplicationCommand) {

        const mappedPermissions: ApplicationCommandPermissionData[] = []

        this.permittedRoles.forEach(value => {
            mappedPermissions.push({
                id: value,
                type: "ROLE",
                permission: true
            })
        })

        await command.permissions.set({
            permissions: mappedPermissions
        })
    }

    abstract execute(interaction: CommandInteraction)

    canExecute(interaction: CommandInteraction): boolean {
        return PermissionsUtil.canExecute(this.permittedRoles, interaction.member as GuildMember)
    }


}