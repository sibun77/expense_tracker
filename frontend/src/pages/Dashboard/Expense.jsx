import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth.jsx';
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import ExpenseOverview from '../../components/Expense/ExpenseOverview.jsx';
import AddExpenseForm from '../../components/Expense/AddExpenseForm.jsx';
import Modal from '../../components/Modal.jsx';
import { toast } from 'react-hot-toast';
import ExpenseList from '../../components/Expense/ExpenseList.jsx';
import DeleteAlert from '../../components/DeleteAlert.jsx';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openEditExpenseModal, setOpenEditExpenseModal] = useState({
    show: false,
    data: null,
  });

  // Fetch All Expenses
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) setExpenseData(response.data);
    } catch (error) {
      console.log('Something went wrong. Please try again.', error);
    } finally {
      setLoading(false);
    }
  };

  // Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) return toast.error('Category is required.');
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error('Amount should be a valid number greater than 0.');
    if (!date) return toast.error('Date is required.');

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success('Expense added successfully');
      fetchExpenseDetails();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  // Edit Expense
  const handleEditExpense = async (updatedExpense) => {
    const { _id, category, amount, date, icon } = updatedExpense;

    if (!category.trim()) return toast.error('Category is required.');
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error('Amount should be a valid number greater than 0.');
    if (!date) return toast.error('Date is required.');

    try {
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(_id), {
        category,
        amount,
        date,
        icon,
      });

      toast.success('Expense updated successfully');
      setOpenEditExpenseModal({ show: false, data: null });
      fetchExpenseDetails();
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Expense deleted successfully');
      fetchExpenseDetails();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  // Download Expense Excel
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob',
        timeout: 30000,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading expense details:', error);
      toast.error('Failed to download expense details.');
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={() => setOpenAddExpenseModal(true)}
          />

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
            onEdit={(expense) => setOpenEditExpenseModal({ show: true, data: expense })}
          />
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title='Add Expense'
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        {/* Delete Expense Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title='Delete Expense'
        >
          <DeleteAlert
            content='Are you sure you want to delete this expense detail?'
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>

        {/* Edit Expense Modal */}
        <Modal
          isOpen={openEditExpenseModal.show}
          onClose={() => setOpenEditExpenseModal({ show: false, data: null })}
          title='Edit Expense'
        >
          <AddExpenseForm
            onAddExpense={handleEditExpense}
            existingData={openEditExpenseModal.data}
            isEditing={true}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
