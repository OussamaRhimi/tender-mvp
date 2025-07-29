// src/app/message/page.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import MessageClientPage from './message-client-page'; // Import the Client Component

export default async function MessagePage() {
  // This runs on the server
  const user = await getCurrentUser();

  // If no user, redirect to login (server-side redirect)
  if (!user) {
    redirect('/login'); // Adjust the path if your login page is elsewhere
  }

  // If user is authenticated, render the client component
  // Pass user data if needed (ensure it's serializable)
  return <MessageClientPage /* user={user} */ />;
}