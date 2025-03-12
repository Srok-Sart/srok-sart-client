export interface PostLike {
    id: number;
    post: { id: number };
    user: { id: number };
    createdAt: Date;
}