export interface UserProfile {
    uid: string;
    n: string;
    e: string;
    d: string;
    g: string;
    pt: string;
    ach: string[];
    fav: Array<{ name: string; vicinity: string }>;
    f: Array<{ n: string; pt: string , uid: string}>;
    h: string[];
    loc: { lat: number; lng: number };
    pre: Array<{ c: string; v: string }>;
    v: boolean;
    ca: string;
    b: string;
}