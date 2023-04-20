import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { LabBillsState } from 'src/@types/labbills';
// sections
import DemoNewEditForm from 'src/sections/demo/LabBillsNewEditForm';
import { useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function DemoEditPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { demos } = useSelector((state: { demo: LabBillsState }) => state.demo);

  const currentDemo = demos.find((LabBills) => paramCase(LabBills.id) === id);

  return (
    <>
      <Helmet>
        <title> LabBills: Editing a lab Bill</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Labbill"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'User',
              href: PATH_DASHBOARD.LabBills.list,
            },
            { name: currentDemo?.id },
          ]}
        />

        <DemoNewEditForm isEdit currentDemo={currentDemo} />
      </Container>
    </>
  );
}
