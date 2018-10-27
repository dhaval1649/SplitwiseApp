using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class PaidBy
    {
        public int PaidById { get; set; }
        public int? ExpenseId { get; set; }
        public int? UserId { get; set; }
        public decimal? PaidAmount { get; set; }

        public Expense Expense { get; set; }
        public Users User { get; set; }
    }
}
