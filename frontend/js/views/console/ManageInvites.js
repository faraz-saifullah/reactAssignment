import React from 'react';
import history from '../../history';
import ManageInvite from '../../components/console/AddNewMember/ManageInvite';
import '../../components/console/AddNewMember/index.scss';

function ManageInvites() {

  const toggleManageInvite = () => {
    history.push('/add-member');
  };

  return (
    <ManageInvite hide={toggleManageInvite} />
  );
}

export default ManageInvites;
