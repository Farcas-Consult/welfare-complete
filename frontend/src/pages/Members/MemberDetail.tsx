import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { membersService, UpdateMemberDto, CreateDependentDto } from '../../services/membersService';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(searchParams.get('edit') === 'true');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dependentDialogOpen, setDependentDialogOpen] = useState(false);

  const { data: member, isLoading } = useQuery(
    ['member', id],
    () => membersService.getById(id!),
    {
      enabled: !!id,
    }
  );

  const { data: dependents } = useQuery(
    ['member-dependents', id],
    () => membersService.getDependents(id!),
    {
      enabled: !!id,
    }
  );

  const updateMutation = useMutation(
    (data: UpdateMemberDto) => membersService.update(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['member', id]);
        enqueueSnackbar('Member updated successfully', { variant: 'success' });
        setIsEditMode(false);
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to update member', { variant: 'error' });
      },
    }
  );

  const deleteMutation = useMutation(
    () => membersService.delete(id!),
    {
      onSuccess: () => {
        enqueueSnackbar('Member deleted successfully', { variant: 'success' });
        navigate('/members');
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to delete member', { variant: 'error' });
      },
    }
  );

  const addDependentMutation = useMutation(
    (data: CreateDependentDto) => membersService.addDependent(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['member-dependents', id]);
        enqueueSnackbar('Dependent added successfully', { variant: 'success' });
        setDependentDialogOpen(false);
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to add dependent', { variant: 'error' });
      },
    }
  );

  const {
    register: registerMember,
    handleSubmit: handleSubmitMember,
    control: controlMember,
    formState: { errors: memberErrors },
    reset: resetMember,
  } = useForm<UpdateMemberDto>({
    defaultValues: member?.data || {},
  });

  const {
    register: registerDependent,
    handleSubmit: handleSubmitDependent,
    control: controlDependent,
    formState: { errors: dependentErrors },
    reset: resetDependent,
  } = useForm<CreateDependentDto>();

  React.useEffect(() => {
    if (member?.data) {
      resetMember(member.data);
    }
  }, [member, resetMember]);

  const onSubmitMember = (data: UpdateMemberDto) => {
    updateMutation.mutate(data);
  };

  const onSubmitDependent = (data: CreateDependentDto) => {
    addDependentMutation.mutate(data);
    resetDependent();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      case 'deceased':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member?.data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error">
          Member not found
        </Typography>
      </Box>
    );
  }

  const memberData = member.data;
  const dependentsList = dependents?.data || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/members')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Member Details
        </Typography>
        {!isEditMode && (
          <>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditMode(true)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        {isEditMode ? (
          <Box component="form" onSubmit={handleSubmitMember(onSubmitMember)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...registerMember('firstName')}
                  error={!!memberErrors.firstName}
                  helperText={memberErrors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  {...registerMember('lastName')}
                  error={!!memberErrors.lastName}
                  helperText={memberErrors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...registerMember('phonePrimary')}
                  error={!!memberErrors.phonePrimary}
                  helperText={memberErrors.phonePrimary?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...registerMember('email')}
                  error={!!memberErrors.email}
                  helperText={memberErrors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updateMutation.isLoading}
                  >
                    {updateMutation.isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Member Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.memberNo || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.firstName} {memberData.middleName} {memberData.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    National ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.nationalId || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Date of Birth
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.dateOfBirth
                      ? format(new Date(memberData.dateOfBirth), 'MMM dd, yyyy')
                      : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Gender
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.gender || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.email || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.phonePrimary || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Membership Status</Typography>
                    <Chip
                      label={memberData.status || 'active'}
                      color={getStatusColor(memberData.status || 'active')}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    KYC Status
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {memberData.kycStatus ? 'Verified' : 'Not Verified'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Dependents</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setDependentDialogOpen(true)}
                    >
                      Add Dependent
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Relationship</TableCell>
                          <TableCell>Date of Birth</TableCell>
                          <TableCell>Beneficiary</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dependentsList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No dependents added
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          dependentsList.map((dependent: any) => (
                            <TableRow key={dependent.id}>
                              <TableCell>
                                {dependent.firstName} {dependent.lastName}
                              </TableCell>
                              <TableCell>{dependent.relationship}</TableCell>
                              <TableCell>
                                {dependent.dateOfBirth
                                  ? format(new Date(dependent.dateOfBirth), 'MMM dd, yyyy')
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {dependent.isBeneficiary ? 'Yes' : 'No'}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this member? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => deleteMutation.mutate()}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dependentDialogOpen} onClose={() => setDependentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Dependent</DialogTitle>
        <Box component="form" onSubmit={handleSubmitDependent(onSubmitDependent)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...registerDependent('firstName', { required: true })}
                  error={!!dependentErrors.firstName}
                  helperText={dependentErrors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  {...registerDependent('lastName', { required: true })}
                  error={!!dependentErrors.lastName}
                  helperText={dependentErrors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Relationship"
                  {...registerDependent('relationship', { required: true })}
                  error={!!dependentErrors.relationship}
                  helperText={dependentErrors.relationship?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="dateOfBirth"
                    control={controlDependent}
                    render={({ field }) => (
                      <DatePicker
                        label="Date of Birth"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!dependentErrors.dateOfBirth,
                            helperText: dependentErrors.dateOfBirth?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDependentDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addDependentMutation.isLoading}
            >
              {addDependentMutation.isLoading ? <CircularProgress size={20} /> : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MemberDetail;
