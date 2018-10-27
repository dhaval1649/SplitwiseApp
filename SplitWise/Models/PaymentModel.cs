using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SplitWise.Models
{
    public class PaymentModel:Payment
    {
        public string paidToName { get; set; }
        public string PaidByName { get; set; }
    }
}
