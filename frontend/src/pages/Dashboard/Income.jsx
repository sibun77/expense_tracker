import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx'
import IncomeOverview from '../../components/Income/IncomeOverview'
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance.js';
import Modal from '../../components/Modal.jsx';
import AddIncomeForm from '../../components/Income/AddIncomeForm.jsx'
import { toast } from 'react-hot-toast'
import IncomeList from '../../components/Income/IncomeList.jsx';
import DeleteAlert from '../../components/DeleteAlert.jsx';
import { useUserAuth } from '../../hooks/useUserAuth.jsx';

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState({
    show: false,
    data: null
  });


  // Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );


      if (response.data) {
        setIncomeData(response.data);
      }

    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    // Validate Checks
    if (!source.trim()) {
      toast.error("Source is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully")
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      )
    }
  };

  // Handle Edit Income
  const handleEditIncome = async (updatedIncome) => {
    const { source, amount, date, icon, _id } = updatedIncome;

    if (!source.trim()) {
      toast.error("Source is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(_id), {
        source,
        amount,
        date,
        icon
      });

      toast.success("Income updated successfully");
      setOpenEditIncomeModal({ show: false, data: null });
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income");
    }
  };


  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }
  };

  //handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details:", error)
      toast.error("Failed to download income details. Please try again.")
    }
  };

  useEffect(() => {
    fetchIncomeDetails();


    return () => { };
  }, [])
  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
            onEdit={(income) => setOpenEditIncomeModal({ show: true, data: income })}
          />

        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure want to delete this income detail?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>

        <Modal
          isOpen={openEditIncomeModal.show}
          onClose={() => setOpenEditIncomeModal({ show: false, data: null })}
          title="Edit Income"
        >
          <AddIncomeForm
            onAddIncome={handleEditIncome}
            existingData={openEditIncomeModal.data}
            isEditing={true}
          />
        </Modal>



      </div>
    </DashboardLayout>
  )
}

export default Income
