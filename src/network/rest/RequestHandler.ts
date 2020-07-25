import { BASE_URL, APIEndpoints } from "../../util/endpoints/API.ts";
import { Client } from "../../client/Client.ts";

export class RequestHandler {
    constructor(private client: Client) {}

    private async request(method: string, endpoint: string, params?: { query?: object, body?: object, headers?: HeadersInit }) {
        const url = new URL(endpoint, BASE_URL);
        if (params?.query) {
            for (const [key, value] of Object.entries(params.query)) {
                url.searchParams.append(key, value);
            }
        }
        const reqHeaders = new Headers(params?.headers);
        reqHeaders.set("Authorization", this.client.token);
        reqHeaders.set("X-Ratelimit-Precision", "milisecond");
        const req = {
            method: method,
            headers: reqHeaders,
            body: params?.body ? JSON.stringify(params.body) : undefined,
        };

        const res = await fetch(new Request(url.href, req));
        if (!res.ok) {
            // TODO
            console.log(`Error ${res.status}: ${res.statusText}`);
            console.log(await res.text());
            return;
        }
        if (res.status == 204) {
            return; // No Content
        }
        return await res.json();
    }

    private async get(endpoint: string, query?: object) {
        return await this.request("GET", endpoint, { query }); 
    }

    private async post(endpoint: string, body: object) {}

    private async patch(endpoint: string, body: object) {
        return await this.request("PATCH", endpoint, { body, headers: { "Content-Type": "application/json" } });
    }

    private async put(endpoint: string, body: object) {}

    private async delete(endpoint: string) {
        return await this.request("DELETE", endpoint);
    }

    // AUDIT LOG
    public async getAuditLog(guildID: string, params?: GetAuditLogParameters) {
        return await this.get(APIEndpoints.GUILD_AUDIT_LOG(guildID), params);
    }

    // CHANNEL
    public async getChannel(channelID: string) {
        return await this.get(APIEndpoints.CHANNEL(channelID));
    }

    public async modifyChannel(channelID: string, params: ModifyChannelParameters) {
        return await this.patch(APIEndpoints.CHANNEL(channelID), params);
    }

    public async deleteChannel(channelID: string) {
        return await this.delete(APIEndpoints.CHANNEL(channelID));
    }

    public async getChannelMessages(channelID: string, params?: GetChannelMessagesParams) {
        return await this.get(APIEndpoints.CHANNEL_MESSAGES(channelID), params);
    }

    public async getChannelMessage(channelID: string, messageID: string) {
        return await this.get(APIEndpoints.CHANNEL_MESSAGE({ channelID, messageID }));
    }

    // GATEWAY
    public async getGatewayBot() {
        return await this.get(APIEndpoints.GATEWAY_BOT);
    }
}

interface Ratelimits {
    limit: number;
    remaining: number;
    bucket: string;
}

interface GetAuditLogParameters {
    user_id?: string,
    action_type?: number,
    before?: string,
    limit?: number,
}

interface ModifyChannelParameters {
    name?: string,
    type?: number,
    position?: number,
    topic?: string,
    nsfw?: boolean,
    rate_limit_per_user?: number,
    bitrate?: number,
    user_limit?: number,
    permission_overwrites?: PermissionOverwrite[],
    parent_id?: string,
}

interface GetChannelMessagesParams {
    around?: string,
    before?: string,
    after?: string,
    limit?: number,
}

interface PermissionOverwrite {
    id: string,
    type: "role" | "member",
    allow: number,
    deny: number,
}
