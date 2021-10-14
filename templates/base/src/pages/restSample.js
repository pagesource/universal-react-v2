export const getStaticProps = async () => {
  const url = 'https://jsonplaceholder.typicode.com/users';
  const res = await fetch(url);
  const data = await res.json();
  return {
    props: { users: data }
  };
};

export const sample = ({ users }) => {
  return (
    <>
      <h1>Sample Rest Page</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
        </div>
      ))}
    </>
  );
};

export default sample;
