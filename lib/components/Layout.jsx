import PropTypes from 'prop-types';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import NavBar from './NavBar';
import GitHubButton from './GitHubButton';

function Layout({ children }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <div className="container-fluid">
      <header>
        <div className="row align-items-center">
          <div className="col-9">
            <Image
              src="/images/bookSwap2.svg"
              alt="Book Swap"
              className="mt-3 mb-3 logo"
              width={250}
              height={71}
              priority
            />
          </div>
          <div className="col-3">
            {loading
              ? null
              : (
                <div>
                  {session ? <GitHubButton onClick={() => signOut('github')}>Sign Out of</GitHubButton> : <GitHubButton onClick={() => signIn('github')}>Sign In with</GitHubButton>}
                </div>
              )}
          </div>
        </div>
        <NavBar session={session} />
      </header>
      <main>
        {loading ? null : children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
