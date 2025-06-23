export interface IDataUser {
    createAccount: string;
    email: string;
    description: string;
    location: {
        lat: number
        lng: number
        };
    name: string;
    preferences: {
        c: string;
        v: string;
    };
}