export interface Follower {
    uid: string;
    n: string;
    pt: string;
}

export interface Group {
    id: string;
    name: string;
    admin: string;
    code: string;
    members: Follower[];
    requests: Follower[];
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    type: string;
    timestamp: any;
}
