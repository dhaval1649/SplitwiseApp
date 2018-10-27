using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SplitWise.Models
{
    public class UserModel : Users
    {
        public int groupId { get; set; }
        public decimal SettlementAmount { get; set; }
        public decimal GetBackAmount { get; set; }
        public decimal OweAmount { get; set; }
        public decimal SettlementAmount1 { get; set; }
        public decimal SettlementAmount2 { get; set; }
        public decimal SettlementAmount3 { get; set; }
        public ICollection<ExpenseDistributionModel> ExpenseDistributionmodel { get; set; }
        public ICollection<PaidByUserModel> PaidByUserModel { get; set; }

    }
}
