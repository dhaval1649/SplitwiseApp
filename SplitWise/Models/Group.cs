using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class Group
    {
        public Group()
        {
            Expense = new HashSet<Expense>();
            GroupMembers = new HashSet<GroupMembers>();
            Payment = new HashSet<Payment>();
        }

        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? AddedDate { get; set; }

        public Users CreatedByNavigation { get; set; }
        public ICollection<Expense> Expense { get; set; }
        public ICollection<GroupMembers> GroupMembers { get; set; }
        public ICollection<Payment> Payment { get; set; }
    }
}
