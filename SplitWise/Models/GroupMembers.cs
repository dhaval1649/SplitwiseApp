using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class GroupMembers
    {
        public int GroupMemberId { get; set; }
        public int? GroupId { get; set; }
        public int? Userid { get; set; }
        public int? CreatedBy { get; set; }
        public int? AddedDate { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Group Group { get; set; }
        public Users User { get; set; }
    }
}
