import PropTypes from 'prop-types';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import NavBar from './NavBar';
import GitHubButton from './GitHubButton';
import Spinner from './Spinner';

function Layout({ children }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <div className="container-fluid">
      <header>
        <div className="d-flex flex-wrap">
          <div className="flex-grow-1">
            <Image
              src="/images/bookSwap2.svg"
              alt="Book Swap"
              className="mt-3 mb-3 logo"
              width={250}
              height={71}
              priority
            />
          </div>
          <div className="align-self-center">
            {loading
              ? null
              : (
                <div className="mb-3 mb-md-0">
                  {session ? <GitHubButton onClick={() => signOut('github')}>Sign Out of</GitHubButton> : <GitHubButton onClick={() => signIn('github')}>Sign In with</GitHubButton>}
                </div>
              )}
          </div>
        </div>
        <NavBar session={session} />
      </header>
      <main>
        {loading ? <Spinner /> : children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
