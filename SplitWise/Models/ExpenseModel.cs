using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SplitWise.Models
{
    public class ExpenseModel : Expense
    {
        public string PaidByName { get; set; }
        public int PaidByCount { get; set; }
        public decimal? SettlementAmount { get; set; }
        public int? Category1Id { get; set; }
        public ICollection<ExpenseDistributionModel> ExpenseDistributionModel { get; set; }
        public ICollection<PaidByUserModel> PaidByUserModel { get; set; }
    }
}
