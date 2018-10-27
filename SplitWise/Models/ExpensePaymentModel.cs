using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SplitWise.Models
{
    public class ExpensePaymentModel
    {
        //Expense
        public int? ExpenseId { get; set; }
        public int? PaidByCount { get; set; }
        public int? PaidBy { get; set; }
        public string Description { get; set; }
        public decimal? SettlementAmount { get; set; }

        //Payment
        public int? PaymentId { get; set; }
        public int? FromUserid { get; set; }
        public int? ToUserId { get; set; }
        public string paidToName { get; set; }

        //For Both
        public decimal? Amount { get; set; }
        public DateTime? ExpenseDate { get; set; }
        public string PaidByName { get; set; }
    }
}
