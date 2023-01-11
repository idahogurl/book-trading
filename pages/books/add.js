import { useSession } from 'next-auth/react';
import Layout from '../../lib/components/Layout';
import ClientOnly from '../../lib/components/ClientOnly';
import AddBooksForm from '../../lib/components/AddBooksForm';

function AddBooks() {
  const { data: session } = useSession();

  return (
    <Layout>
      <h1>Add Books to Owned</h1>
      <ClientOnly>
        <AddBooksForm sessionUserId={session?.user.id} />
      </ClientOnly>
    </Layout>
  );
}

export default AddBooks;
