import { useQuery } from "@tanstack/react-query";

const fetchImage = async (url?: string): Promise<Blob> => {
  const response = await fetch(url ?? "");
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }
  return response.blob();
};

export const useImageFile = (
  filename: string,
  mimeType: string,
  url?: string,
) => {
  return useQuery({
    queryKey: ["image", url],
    queryFn: () => fetchImage(url),
    enabled: !!url,
    select: (blob) => new File([blob], filename, { type: mimeType }),
    staleTime: Infinity,
  });
};
