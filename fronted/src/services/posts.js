import { ID, Query, databases } from "./config";

export const createPost = async (title, content, userId) => {
    try {
        const slug = ID.unique();
        const post = await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
            ID.unique(),
            {
                title,
                content,
                userId,
                createdAt: new Date().toISOString(),
                slug
            }
        );
        return post;
    } catch (error) {
        console.error("Create post error:", error);
        throw error;
    }
};

export const getPosts = async (userId, limit = 10, offset = 0) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.orderDesc('createdAt'),
                Query.limit(limit),
                Query.offset(offset)
            ]
        );
        return response.documents;
    } catch (error) {
        console.error("Get posts error:", error);
        return [];
    }
};

export const getPostBySlug = async (slug) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
            [Query.equal('slug', slug)]
        );
        return response.documents[0];
    } catch (error) {
        console.error("Get post error:", error);
        return null;
    }
};