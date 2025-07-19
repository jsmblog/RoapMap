export const getAllHashTags = (post: string,type:string): string[] | string => {
  if (typeof post !== 'string') return 'Tipo de dato no soportado';
  let matches;
  if(type !== 'hashtags') {
    matches = post
    .replace(/#\w+/g, '')          
    .replace(/\s+/g, ' ')        
    .trim(); 
  }else {
    matches = post.match(/#(\w+)/g);
  }
  return matches || [];
};
