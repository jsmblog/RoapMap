export const getTimeAgo = (e: string): string => {
    const t: [string, number][] = [
        ["año", 31536e3],
        ["m", 2592e3],
        ["sem", 604800],
        ["d", 86400],
        ["h", 3600],
        ["min", 60],
        ["seg", 1]
    ];
    let o: number = (Date.now() - Date.parse(e)) / 1e3;
    for (const [e, n] of t)
        if (o >= n) return `${~~(o / n)} ${e}`;
    return "0 seg";
};