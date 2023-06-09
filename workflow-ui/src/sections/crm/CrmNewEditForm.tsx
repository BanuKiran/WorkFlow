import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker, LoadingButton } from '@mui/lab';
import * as material from '@mui/material';
// utils
import { Crm, CrmRequest } from 'src/@types/crm';
// routes
import { dispatch } from 'src/redux/store';
import { addCrm, updateCrm } from 'src/redux/slices/crm';
import { format } from 'date-fns';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';
import * as paths from '../../routes/paths';
// @types
// assets
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

interface FormValuesProps extends Partial<Crm> {}

type Props = {
  isEdit?: boolean;
  currentCrm?: Crm;
};

export default function CrmNewEditForm({ isEdit = false, currentCrm }: Props) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('FirstName is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentCrm?.id || '',
      firstName: currentCrm?.firstName || '',
      lastName: currentCrm?.lastName || '',
      email: currentCrm?.email || '',
      type: currentCrm?.type || '',
      joinDate: currentCrm?.joinDate || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCrm]
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
    if (isEdit && currentCrm) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCrm]);

  const onSubmit = async (data: FormValuesProps) => {
    const request: CrmRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      joinDate: format(new Date(data.joinDate || ''), 'yyyy-mm-dd'),
      type: data.type,
    };

    try {
      if (isEdit && currentCrm) {
        request.id = data.id;
        dispatch(updateCrm(request));
      }
      if (!isEdit) {
        dispatch(addCrm(request));
        reset();
      }
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(paths.PATH_DASHBOARD.user.list);
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="type" label="Type" />
              <Controller
                name="joinDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="joinDate"
                    value={field.value}
                    onChange={(newValue: any) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params: any) => (
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
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create CRM' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
