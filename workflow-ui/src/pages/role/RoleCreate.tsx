import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import RoleNewEditForm from 'src/sections/@dashboard/user/role/RoleNewEditForm';

// sections
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RoleState } from '../../@types/role';
import { getRole } from '../../redux/slices/role';
import { dispatch } from '../../redux/store';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';

// components
import { useSettingsContext } from '../../components/settings';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// ----------------------------------------------------------------------

export default function RoleCreate() {
  const { themeStretch } = useSettingsContext();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { roles } = useSelector((state: { role: RoleState }) => state.role);

  const currentRole = roles.find((Role) => paramCase(Role.id) === id);

  useEffect(() => {
    dispatch(getRole());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={!isEdit ? 'Create a new Role' : 'Edit Role'}
        links={[
          { name: 'USER', href: PATH_DASHBOARD.user.root },
          { name: 'Role', href: PATH_DASHBOARD.user.role },
          { name: !isEdit ? 'New Role' : capitalCase(id) },
        ]}
      />

      <RoleNewEditForm isEdit={isEdit} currentRole={currentRole} />
    </Container>
  );
}
