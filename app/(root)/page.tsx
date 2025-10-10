import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid');
  const user = cookieStore.get('User');

  if (!uid) {
    redirect('/login');
  }
  else {
    redirect('/dashboard');
  }

}
