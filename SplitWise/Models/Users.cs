using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class Users
    {
        public Users()
        {
            AmtDistributionToUser = new HashSet<AmtDistribution>();
            AmtDistributionUser = new HashSet<AmtDistribution>();
            Category1 = new HashSet<Category1>();
            Category2 = new HashSet<Category2>();
            ChangeLogs = new HashSet<ChangeLogs>();
            ExpenseCreatedbyNavigation = new HashSet<Expense>();
            ExpenseDistribution = new HashSet<ExpenseDistribution>();
            ExpenseOwndbyNavigation = new HashSet<Expense>();
            ExpensePaidByNavigation = new HashSet<Expense>();
            Group = new HashSet<Group>();
            GroupMembersCreatedByNavigation = new HashSet<GroupMembers>();
            GroupMembersUser = new HashSet<GroupMembers>();
            PaidByUserToUser = new HashSet<PaidByUser>();
            PaidByUserUser = new HashSet<PaidByUser>();
            PaymentCreatedbyNavigation = new HashSet<Payment>();
            PaymentFromUser = new HashSet<Payment>();
            PaymentToUser = new HashSet<Payment>();
            UserFriendsActionUser = new HashSet<UserFriends>();
            UserFriendsUserOne = new HashSet<UserFriends>();
            UserFriendsUserTwo = new HashSet<UserFriends>();
        }

        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime? RegisteredDate { get; set; }

        public ICollection<AmtDistribution> AmtDistributionToUser { get; set; }
        public ICollection<AmtDistribution> AmtDistributionUser { get; set; }
        public ICollection<Category1> Category1 { get; set; }
        public ICollection<Category2> Category2 { get; set; }
        public ICollection<ChangeLogs> ChangeLogs { get; set; }
        public ICollection<Expense> ExpenseCreatedbyNavigation { get; set; }
        public ICollection<ExpenseDistribution> ExpenseDistribution { get; set; }
        public ICollection<Expense> ExpenseOwndbyNavigation { get; set; }
        public ICollection<Expense> ExpensePaidByNavigation { get; set; }
        public ICollection<Group> Group { get; set; }
        public ICollection<GroupMembers> GroupMembersCreatedByNavigation { get; set; }
        public ICollection<GroupMembers> GroupMembersUser { get; set; }
        public ICollection<PaidByUser> PaidByUserToUser { get; set; }
        public ICollection<PaidByUser> PaidByUserUser { get; set; }
        public ICollection<Payment> PaymentCreatedbyNavigation { get; set; }
        public ICollection<Payment> PaymentFromUser { get; set; }
        public ICollection<Payment> PaymentToUser { get; set; }
        public ICollection<UserFriends> UserFriendsActionUser { get; set; }
        public ICollection<UserFriends> UserFriendsUserOne { get; set; }
        public ICollection<UserFriends> UserFriendsUserTwo { get; set; }
    }
}
