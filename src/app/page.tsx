import { redirect } from 'next/navigation';

const HomePage = () => {
  // Redirect to teams page as the main page
  redirect('/teams');
};

export default HomePage;
