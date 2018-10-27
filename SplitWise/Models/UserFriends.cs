using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class UserFriends
    {
        public int UserFriendsId { get; set; }
        public int? UserOneId { get; set; }
        public int? UserTwoId { get; set; }
        public int? Status { get; set; }
        public int? ActionUserId { get; set; }
        public DateTime? AddedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public Users ActionUser { get; set; }
        public Status StatusNavigation { get; set; }
        public Users UserOne { get; set; }
        public Users UserTwo { get; set; }
    }
}
