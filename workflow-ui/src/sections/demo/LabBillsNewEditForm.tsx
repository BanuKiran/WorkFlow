import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import * as material from '@mui/material';
// utils
import { LabBills, LabBillsRequest } from 'src/@types/labbills';
// routes
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { dispatch } from 'src/redux/store';
import { addDemo, updateDemo } from 'src/redux/slices/labbills';
import { format } from 'date-fns';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';
import moment from 'moment';
import * as paths from '../../routes/paths';
// @types
// assets
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFEditor, RHFSelect, RHFTextField } from '../../components/hook-form';


// ----------------------------------------------------------------------

interface FormValuesProps extends Partial<LabBills> {}

type Props = {
  isEdit?: boolean;
  currentDemo?: LabBills;
};

export default function DemoNewEditForm(this: any, { isEdit = false, currentDemo }: Props) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    // validations for error message
    billNo: Yup.string().required('Bill No is required'),
    patientId: Yup.string().required('Patient Id is required'),
    patientName: Yup.string().required('Patient Name is required'),
    reportDate: Yup.string(),
    doctorName: Yup.string().required('Doctor Name is required'),
    discount: Yup.string().required('Discount is required'),
    amount: Yup.string().required('Amount is required'),
    paid: Yup.string().required('Paid is required'),
    balance: Yup.string().required('Balance is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentDemo?.id || '',
      // firstName: currentDemo?.firstName || '',
      // lastName: currentDemo?.lastName || '',
      // email: currentDemo?.email || '',
      // type: currentDemo?.type || '',
      // joinDate: currentDemo?.joinDate || '',
      // description: currentDemo?.description || '',
      billNo: currentDemo?.billNo || '',
      patientId: currentDemo?.patientId || '',
      patientName: currentDemo?.patientName || '',
      reportDate: currentDemo?.reportDate || '',
      doctorName: currentDemo?.doctorName || '',
      discount: currentDemo?.discount || '',
      amount: currentDemo?.amount,
      paid: currentDemo?.paid,
      balance: currentDemo?.balance,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDemo]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentDemo) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentDemo]);

  const handelTextAreaChange = (e: any) => {
    console.log(e);
  };
  const onSubmit = async (data: FormValuesProps) => {
    const request: LabBillsRequest = {
      // firstName: data.firstName,
      // lastName: data.lastName,
      // email: data.email,
      // joinDate: format(new Date(data.joinDate || ''), 'yyyy-mm-dd'),
      // type: data.type,
      billNo: data.billNo,
      patientId: data.patientId,
      patientName: data.patientName,
      // reportDate: data.reportDate,
      reportDate: moment(data.reportDate).format('YYYY-MM-DD'),
      doctorName: data.doctorName,
      discount: data.discount,
      amount: data.amount,
      paid: data.paid,
      balance: data.balance,
    };

    try {
      if (isEdit && currentDemo) {
        request.id = currentDemo?.id;
        dispatch(updateDemo(request));
      }
      if (!isEdit) {
        dispatch(addDemo(request));
        reset();
      }
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(paths.PATH_DASHBOARD.LabBills.list);
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} spacing={3}>
          <Card sx={{ p: 3, width: '150%', height: '350px' }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 5,
                rowGap: 6,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
              }}
            >
              <RHFTextField name="billNo" label="Bill No" />

              <RHFTextField name="patientId" label="Patient Id" />

              <RHFTextField name="patientName" label="Patient Name" />

              {/* <RHFTextField name="reportdate" label="Report Date" /> */}

              <Controller
                name="reportDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="report Date"
                    value={field.value}
                    onChange={(newValue:any) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params:any) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />

              <RHFTextField name="doctorName" label="Doctor Name" />
              
              {/* <RHFSelect
                name={dropdownRole}
                value={dropdownRole}
                label="DoctorName"
                placeholder="DoctorName"
                onChange={onchange}
              >
                <option value="" />
                {roles.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect> */}

              <RHFTextField name="discount" label="Discount" />

              <RHFTextField name="amount" label="Amount" />

              <RHFTextField name="paid" label="Paid" />

              <RHFTextField name="balance" label="Balance" />

            </Box>
          </Card>
          <Stack alignItems="flex" sx={{ mt: 3, flexDirection: 'row', pl: 168, width: '200%' }}>
            {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ marginRight: 'auto' ,mx: 2, borderRadius: 10 }}>
              {!isEdit ? 'Save & Print' : 'Save Changes'}
            </LoadingButton> */}
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Save Bills' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
