export interface PostData {
  id: string;
  uid:string;
  post: {
    txt: string;
    ht: string[];
    fl: string;
    ft: string;
    img: string;
    n: string;
    likes: any[];
    comments: any[];
    share: any[];
  };
  d: string;
}