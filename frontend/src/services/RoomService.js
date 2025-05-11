import { api } from "../config/AxiosHelper"

export function healthCheck() {
    return async function () {
        const res = await api.get('/health-check');
        console.log(res.data);
    }
}

export async function createRoomApi(roomDetail) {
    const res = await api.post('/api/v1/rooms', roomDetail,
        {
            headers: {
                "Content-Type": "plain/text"
            }
        }
    );
    return res.data;
}

export async function joinChatApi(roomId) {
    const res = await api.get(`/api/v1/rooms/${roomId}`);
    return res.data;
}

export async function getMessages(roomId) {
    const response = await api.get(
        `/api/v1/rooms/${roomId}`
    );
    return response.data;
}