using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class Expense
    {
        public Expense()
        {
            AmtDistribution = new HashSet<AmtDistribution>();
            ExpenseDistribution = new HashSet<ExpenseDistribution>();
            PaidByUser = new HashSet<PaidByUser>();
        }

        public int ExpenseId { get; set; }
        public string Description { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? ExpenseDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? Category2 { get; set; }
        public string Attachment { get; set; }
        public string Notes { get; set; }
        public int? PaidBy { get; set; }
        public int? Groupid { get; set; }
        public int? Createdby { get; set; }
        public int? Owndby { get; set; }
        public int? SplitEqually { get; set; }

        public Category2 Category2Navigation { get; set; }
        public Users CreatedbyNavigation { get; set; }
        public Group Group { get; set; }
        public Users OwndbyNavigation { get; set; }
        public Users PaidByNavigation { get; set; }
        public ICollection<AmtDistribution> AmtDistribution { get; set; }
        public ICollection<ExpenseDistribution> ExpenseDistribution { get; set; }
        public ICollection<PaidByUser> PaidByUser { get; set; }
    }
}
