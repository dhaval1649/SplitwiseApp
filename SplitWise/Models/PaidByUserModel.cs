using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SplitWise.Models
{
    public class PaidByUserModel
    {
        public int PaidByUserId { get; set; }
        public int? ExpenseId { get; set; }
        public int? UserId { get; set; }
        public decimal? PaidAmount { get; set; }
    }
}
