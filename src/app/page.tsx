import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to teams page as the main page
  redirect('/teams');
}
