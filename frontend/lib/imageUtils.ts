/**
 * Get full image URL for a book image
 * @param imageUrl - The image filename stored in the database
 * @returns Full URL to the image or placeholder
 */
export function getBookImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return '/placeholder-book.jpg';
  }
  
  // If it's already a full URL (starts with http), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, construct the URL using the image endpoint
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return `${apiUrl}/api/images/books/${imageUrl}`;
}

