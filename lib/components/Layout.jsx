import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import NavBar from './NavBar';
import GitHubButton from './GitHubButton';

function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="container-fluid">
      <header>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <Image
              src="/images/bookSwap2.svg"
              alt="Book Swap"
              className="mt-3 mb-3 logo"
              width={250}
              height={71}
            />
          </div>
          <div>{session ? <GitHubButton onClick={() => signOut('github')}>Sign Out of</GitHubButton> : <GitHubButton onClick={() => signIn('github')}>Sign In with</GitHubButton>}</div>
        </div>
        <NavBar session={session} />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;
