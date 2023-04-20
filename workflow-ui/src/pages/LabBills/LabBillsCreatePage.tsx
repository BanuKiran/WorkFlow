import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import DemoNewEditForm from 'src/sections/demo/LabBillsNewEditForm';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function DemoCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> LabBills: Generating a New Lab Bill | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Generating a New Lab Bill"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'LabBills',
              href: PATH_DASHBOARD.LabBills.list,
            },
            { name: 'New Bill' },
          ]}
        />
        <DemoNewEditForm />
      </Container>
    </>
  );
}
