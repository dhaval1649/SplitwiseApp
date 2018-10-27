using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class Payment
    {
        public int PaymentId { get; set; }
        public int? FromUserid { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? PaymentDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string Attachment { get; set; }
        public string Notes { get; set; }
        public int? Createdby { get; set; }
        public int? PaymentMode { get; set; }
        public int? ToUserId { get; set; }
        public int? GroupId { get; set; }

        public Users CreatedbyNavigation { get; set; }
        public Users FromUser { get; set; }
        public Group Group { get; set; }
        public Users ToUser { get; set; }
    }
}
