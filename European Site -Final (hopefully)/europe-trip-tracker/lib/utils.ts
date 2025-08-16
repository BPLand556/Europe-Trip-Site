import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title?: string): string {
  if (!title) {
    return `post-${Date.now()}`;
  }
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function groupPostsByDate(posts: any[]) {
  const groups: Record<string, any[]> = {};
  
  posts.forEach(post => {
    const date = formatDate(post.takenAt || post.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(post);
  });
  
  return Object.entries(groups).sort(([a], [b]) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
}

export function groupPostsByCity(posts: any[]) {
  const groups: Record<string, any[]> = {};
  
  posts.forEach(post => {
    const city = post.city || 'Unknown Location';
    if (!groups[city]) {
      groups[city] = [];
    }
    groups[city].push(post);
  });
  
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}
