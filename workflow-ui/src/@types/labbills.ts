export type LabBills = {
  id: string;
  billNo: string;
  patientId: string;
  patientName: string;
  reportDate?: string;
  doctorName: string;
  discount: string;
  amount: string;
  paid: string;
  balance: string;
};

export type LabBillsRequest = {
  id?: string;
  billNo?: string;
  patientId?: string;
  patientName?: string;
  reportDate?: string;
  doctorName?: string;
  discount?: string;
  amount?: string;
  paid?: string;
  balance?: string;
};

export type LabBillsState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  demos: LabBills[];
  demo: LabBills | null;
  sortBy: string | null;
  filters: {
    email: string;
  };
  selectedDemosName: string;
};
