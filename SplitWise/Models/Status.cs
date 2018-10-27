using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class Status
    {
        public Status()
        {
            UserFriends = new HashSet<UserFriends>();
        }

        public int StatusId { get; set; }
        public string Title { get; set; }

        public ICollection<UserFriends> UserFriends { get; set; }
    }
}
