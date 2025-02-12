import {  databases } from "../appwrite";
import { ID, Query, } from 'appwrite'

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

export const deletePost = async (postId) => {
    try {
        await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
            postId
        );
        return true;
    } catch (error) {
        console.error("Delete post error:", error);
        throw error;
    }
};

export const updatePost = async (postId, { title, content }) => {
    try {
        const post = await databases.updateDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
            postId,
            {
                title,
                content
            }
        );
        return post;
    } catch (error) {
        console.error("Update post error:", error);
        throw error;
    }
};