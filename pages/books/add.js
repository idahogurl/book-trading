import { useSession } from 'next-auth/react';
import Layout from '../../lib/components/Layout';
import AddBooksForm from '../../lib/components/AddBooksForm';

function AddBooks() {
  const { data: session } = useSession();

  return (
    <Layout>
      <h1>Add Books to Owned</h1>
      <AddBooksForm sessionUserId={session?.user.id} />
    </Layout>
  );
}

export default AddBooks;
