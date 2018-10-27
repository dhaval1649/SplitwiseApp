using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class ExpenseDistribution
    {
        public int ExpenseDistributionId { get; set; }
        public int? ExpenseId { get; set; }
        public int? UserId { get; set; }
        public decimal? ShareAmount { get; set; }
        public int? Share { get; set; }

        public Expense Expense { get; set; }
        public Users User { get; set; }
    }
}
