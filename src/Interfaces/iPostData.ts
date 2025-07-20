export interface PostData {
  id: string;
  post: {
    txt: string;
    ht: string[];
    fl: string;
    ft: string;
    img: string;
    n: string;
    likes: number;
    comments: any[];
    share: number;
  };
  d: string;
}