﻿using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class PaidByUser
    {
        public int PaidByUserId { get; set; }
        public int? ExpenseId { get; set; }
        public int? UserId { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? RemainingAmount { get; set; }
        public int? ToUserId { get; set; }

        public Expense Expense { get; set; }
        public Users ToUser { get; set; }
        public Users User { get; set; }
    }
}
