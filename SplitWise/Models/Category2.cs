using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class Category2
    {
        public Category2()
        {
            Expense = new HashSet<Expense>();
        }

        public int Category2Id { get; set; }
        public string Title { get; set; }
        public int? Category1Id { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? AddedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public Category1 Category1 { get; set; }
        public Users UpdatedByNavigation { get; set; }
        public ICollection<Expense> Expense { get; set; }
    }
}
