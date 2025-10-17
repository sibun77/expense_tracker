import React from 'react'
import { LuDownload } from 'react-icons/lu'
import { FaEdit } from "react-icons/fa";
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const IncomeList = ({ transactions, onDelete, onDownload, onEdit }) => {
    return (
        <div className='card'>
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income Sources</h5>
                <button className='card-btn' onClick={onDownload}>
                    <LuDownload className='text-base' /> Download
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions?.map((income) => (
                    <div key={income._id} className="relative">
                        <TransactionInfoCard
                            key={income._id}
                            title={income.source}
                            icon={income.icon}
                            date={moment(income.date).format("Do MMM YYYY")}
                            amount={income.amount}
                            type="income"
                            onDelete={() => onDelete(income._id)}
                            onEdit={() => onEdit(income)}   // 👈 pass handler here
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default IncomeList
