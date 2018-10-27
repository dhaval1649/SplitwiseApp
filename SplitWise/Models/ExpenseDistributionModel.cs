using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SplitWise.Models
{
    public class ExpenseDistributionModel
    {
        public int ExpenseDistributionId { get; set; }
        public int? ExpenseId { get; set; }
        public int? UserId { get; set; }
        public decimal? ShareAmount { get; set; }
        public int? Share { get; set; }
    }
}
