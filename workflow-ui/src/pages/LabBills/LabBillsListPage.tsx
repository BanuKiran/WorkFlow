import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { dispatch, useSelector } from 'src/redux/store';
import { deleteDemo, getDemo } from 'src/redux/slices/labbills';
import { LabBills, LabBillsState } from 'src/@types/labbills';
import DemoTableRow from 'src/sections/demo/list/LabBillsTableRow';
import DemoTableToolbar from 'src/sections/demo/list/LabBillsTableToolbar';
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { IUserAccountGeneral } from '../../@types/user';
// _mock_
import { _customerList } from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';

// ------------------------------------------------------------------------

// const STATUS_OPTIONS = ['all'];

// const TYPE_OPTIONS = ['all'];

const TABLE_HEAD = [
  { id: 'id', label: 'id', align: 'left' },
  { id: 'bill no', label: 'Bill No(📃)', align: 'left' },
  { id: 'patient id', label: 'Patient Id(📑)', align: 'left' },
  { id: 'patient name', label: 'Patient Name(📜)', align: 'left' },
  { id: 'report date', label: 'Report Date(📆)', align: 'left' },
  { id: 'doctor name', label: 'Doctor Name(👨‍⚕️)', align: 'left' },
  { id: 'amount', label: 'Amount(र)', align: 'left', width: 140 },
  { id: 'discount', label: 'Discount(🏧)', align: 'left' },
  { id: 'paid', label: 'Paid☑', align: 'left' },
  { id: 'balance', label: 'Balance(र)', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'center' },

];

// ----------------------------------------------------------------------

export default function DemoListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const { demos } = useSelector((state: { demo: LabBillsState }) => state.demo);

  useEffect(() => {
    dispatch(getDemo());
  }, []);

  const [filterName, setFilterName] = useState('');

  const [filterType, setFilterType] = useState('all');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const dataFiltered = applyFilter({
    inputData: demos,
    comparator: getComparator(order, orderBy),
    filterName,
    filterType,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterType !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterType) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterType(event.target.value);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = demos.filter((row) => row.id !== id);
    setSelected([]);
    // deleteRow.map((row) => dispatch(deleteDemo(row.id)));

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows: string[]) => {
    const deleteRows = demos.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);

    deleteRows.map((row) => dispatch(deleteDemo(row.id)));

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((demos.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.LabBills.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterType('all');
    setFilterStatus('all');
  };

  return (
    <>
      <Helmet>
        <title> Lab: Bills</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Lab Bills"
          links={[
            { name: 'DashBoard', href: PATH_DASHBOARD.root },
            { name: 'Lab Bills', href: PATH_DASHBOARD.LabBills.root },
            { name: 'List' },
          ]}
          action={
            <>
              {/* <Button
                component={RouterLink}
                to={PATH_DASHBOARD.LabBills.new}
                variant="contained"
                startIcon={<Iconify icon="tabler:letter-v" />}
              >
              Export 
              </Button> */}
              <Button
                  sx={{ px:4, m:2 }}
                  component={RouterLink}
                  to={PATH_DASHBOARD.LabBills.new}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Generate Bill
                </Button>
            </>
          }
        />

        <Card>
          <Divider />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={demos.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  demos.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={demos.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      demos.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DemoTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, demos.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterType,
}: {
  inputData: LabBills[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterType: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (filterName) {
  //   inputData = inputData.filter(
  //     (LabBills) => LabBills.billNo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
  //   );
  // }c
  // if (filterStatus !== 'all') {
  //   inputData = inputData.filter((demo) => demo.type === filterStatus);
  // }

  // if (filterType !== 'all') {
  //   inputData = inputData.filter((demo) => demo.type === filterType);
  // }

  return inputData;
}
