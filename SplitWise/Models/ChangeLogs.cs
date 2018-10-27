using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class ChangeLogs
    {
        public int LogId { get; set; }
        public string Description { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? AddedDate { get; set; }

        public Users CreatedByNavigation { get; set; }
    }
}
