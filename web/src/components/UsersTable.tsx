import type { User } from '@fake-user-data/shared';

interface UsersTableProps {
  users: User[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <table className='table table-striped mb-0'>
      <thead className='text-nowrap'>
        <tr>
          <th scope='col'>Index</th>
          <th scope='col'>ID</th>
          <th scope='col'>Full name</th>
          <th scope='col'>Address</th>
          <th scope='col'>Phone number</th>
        </tr>
      </thead>
      <tbody className='table-group-divider'>
        {users.map((user, i) => (
          <tr key={user.id}>
            <th scope='row'>{i + 1}</th>
            <td>{user.id}</td>
            <td>{user.fullName}</td>
            <td>{user.address}</td>
            <td>{user.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
