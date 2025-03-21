import { fetcher } from "@/api/use-fetcher";

export const markPostAsCompleted = async (postId: number) => {
  try {
    const response = await fetcher(`/posts/${postId}/complete`, {
      method: "POST",
    });

    const { message } = response as { message: string };

    return message;
  } catch (error) {
    console.error("Error marking post as completed:", error);
    throw error;
  }
};
