using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SplitWise.Models
{
    public partial class SplitWiseContext : DbContext
    {
        public SplitWiseContext()
        {
        }

        public SplitWiseContext(DbContextOptions<SplitWiseContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AmtDistribution> AmtDistribution { get; set; }
        public virtual DbSet<Category1> Category1 { get; set; }
        public virtual DbSet<Category2> Category2 { get; set; }
        public virtual DbSet<ChangeLogs> ChangeLogs { get; set; }
        public virtual DbSet<Expense> Expense { get; set; }
        public virtual DbSet<ExpenseDistribution> ExpenseDistribution { get; set; }
        public virtual DbSet<Group> Group { get; set; }
        public virtual DbSet<GroupMembers> GroupMembers { get; set; }
        public virtual DbSet<PaidByUser> PaidByUser { get; set; }
        public virtual DbSet<Payment> Payment { get; set; }
        public virtual DbSet<Status> Status { get; set; }
        public virtual DbSet<UserFriends> UserFriends { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=(localdb)\\dhaval;Initial Catalog=SplitWiseNew1;Integrated Security=True;Pooling=False");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AmtDistribution>(entity =>
            {
                entity.Property(e => e.AmtDistributionId).HasColumnName("amtDistributionId");

                entity.Property(e => e.ExpenseId).HasColumnName("expenseId");

                entity.Property(e => e.IsPaid)
                    .HasColumnName("isPaid")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.RemainingAmount)
                    .HasColumnName("remainingAmount")
                    .HasColumnType("decimal(9, 2)");

                entity.Property(e => e.ToUserId).HasColumnName("toUserId");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Expense)
                    .WithMany(p => p.AmtDistribution)
                    .HasForeignKey(d => d.ExpenseId)
                    .HasConstraintName("FK__AmtDistri__expen__3C34F16F");

                entity.HasOne(d => d.ToUser)
                    .WithMany(p => p.AmtDistributionToUser)
                    .HasForeignKey(d => d.ToUserId)
                    .HasConstraintName("FK__AmtDistri__toUse__3E1D39E1");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AmtDistributionUser)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__AmtDistri__userI__3D2915A8");
            });

            modelBuilder.Entity<Category1>(entity =>
            {
                entity.Property(e => e.AddedDate)
                    .HasColumnName("addedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.Title)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy).HasColumnName("updatedBy");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updatedDate")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.UpdatedByNavigation)
                    .WithMany(p => p.Category1)
                    .HasForeignKey(d => d.UpdatedBy)
                    .HasConstraintName("FK__Category1__updat__01142BA1");
            });
            //modelBuilder.Entity<Category1>().HasData(
            //    new Category1 { Category1Id = 1, Title = "General" }
            //    );
            modelBuilder.Entity<Category2>(entity =>
            {
                entity.Property(e => e.AddedDate)
                    .HasColumnName("addedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Category1Id).HasColumnName("category1Id");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.Title)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy).HasColumnName("updatedBy");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updatedDate")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.Category1)
                    .WithMany(p => p.Category2)
                    .HasForeignKey(d => d.Category1Id)
                    .HasConstraintName("FK__Category2__categ__05D8E0BE");

                entity.HasOne(d => d.UpdatedByNavigation)
                    .WithMany(p => p.Category2)
                    .HasForeignKey(d => d.UpdatedBy)
                    .HasConstraintName("FK__Category2__updat__06CD04F7");
            });

            modelBuilder.Entity<ChangeLogs>(entity =>
            {
                entity.HasKey(e => e.LogId);

                entity.Property(e => e.LogId).HasColumnName("logId");

                entity.Property(e => e.AddedDate)
                    .HasColumnName("addedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ChangeLogs)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK__ChangeLog__creat__74AE54BC");
            });

            modelBuilder.Entity<Expense>(entity =>
            {
                entity.Property(e => e.ExpenseId).HasColumnName("expenseId");

                entity.Property(e => e.Amount)
                    .HasColumnName("amount")
                    .HasColumnType("decimal(9, 2)");

                entity.Property(e => e.Attachment)
                    .HasColumnName("attachment")
                    .IsUnicode(false);

                entity.Property(e => e.Category2).HasColumnName("category2");

                entity.Property(e => e.Createdby).HasColumnName("createdby");

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .IsUnicode(false);

                entity.Property(e => e.ExpenseDate)
                    .HasColumnName("expenseDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Groupid)
                    .HasColumnName("groupid");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .IsUnicode(false);

                entity.Property(e => e.Owndby).HasColumnName("owndby");

                entity.Property(e => e.PaidBy).HasColumnName("paidBy");

                entity.Property(e => e.SplitEqually).HasColumnName("splitEqually");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updatedDate")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.Category2Navigation)
                    .WithMany(p => p.Expense)
                    .HasForeignKey(d => d.Category2)
                    .HasConstraintName("FK__Expense__categor__04E4BC85");

                entity.HasOne(d => d.CreatedbyNavigation)
                    .WithMany(p => p.ExpenseCreatedbyNavigation)
                    .HasForeignKey(d => d.Createdby)
                    .HasConstraintName("FK__Expense__created__778AC167");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Expense)
                    .HasForeignKey(d => d.Groupid)
                    .HasConstraintName("FK__Expense__groupid__787EE5A0");

                entity.HasOne(d => d.OwndbyNavigation)
                    .WithMany(p => p.ExpenseOwndbyNavigation)
                    .HasForeignKey(d => d.Owndby)
                    .HasConstraintName("FK__Expense__owndby__797309D9");

                entity.HasOne(d => d.PaidByNavigation)
                    .WithMany(p => p.ExpensePaidByNavigation)
                    .HasForeignKey(d => d.PaidBy)
                    .HasConstraintName("FK__Expense__paidBy__76969D2E");
            });

            modelBuilder.Entity<ExpenseDistribution>(entity =>
            {
                entity.Property(e => e.ExpenseId).HasColumnName("expenseId");

                entity.Property(e => e.Share).HasColumnName("share");

                entity.Property(e => e.ShareAmount)
                    .HasColumnName("shareAmount")
                    .HasColumnType("decimal(9, 2)");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Expense)
                    .WithMany(p => p.ExpenseDistribution)
                    .HasForeignKey(d => d.ExpenseId)
                    .HasConstraintName("FK__ExpenseDi__expen__7A672E12");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ExpenseDistribution)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__ExpenseDi__userI__7B5B524B");
            });

            modelBuilder.Entity<Group>(entity =>
            {
                entity.Property(e => e.GroupId).HasColumnName("groupId");

                entity.Property(e => e.AddedDate)
                    .HasColumnName("addedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.GroupName)
                    .HasColumnName("groupName")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Group)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK__Group__createdBy__7C4F7684");
            });

            modelBuilder.Entity<GroupMembers>(entity =>
            {
                entity.HasKey(e => e.GroupMemberId);

                entity.Property(e => e.GroupMemberId).HasColumnName("groupMemberId");

                entity.Property(e => e.AddedDate).HasColumnName("addedDate");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.GroupId).HasColumnName("groupId");

                entity.Property(e => e.Userid).HasColumnName("userid");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.GroupMembersCreatedByNavigation)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK__GroupMemb__creat__0B91BA14");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.GroupMembers)
                    .HasForeignKey(d => d.GroupId)
                    .HasConstraintName("FK__GroupMemb__group__14270015");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.GroupMembersUser)
                    .HasForeignKey(d => d.Userid)
                    .HasConstraintName("FK__GroupMemb__useri__0A9D95DB");
            });

            modelBuilder.Entity<PaidByUser>(entity =>
            {
                entity.Property(e => e.ExpenseId).HasColumnName("expenseId");

                entity.Property(e => e.PaidAmount)
                    .HasColumnName("paidAmount")
                    .HasColumnType("decimal(9, 2)");

                entity.Property(e => e.RemainingAmount)
                    .HasColumnName("remainingAmount")
                    .HasColumnType("decimal(9, 2)");

                entity.Property(e => e.ToUserId).HasColumnName("toUserId");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Expense)
                    .WithMany(p => p.PaidByUser)
                    .HasForeignKey(d => d.ExpenseId)
                    .HasConstraintName("FK__PaidByUse__expen__2CF2ADDF");

                entity.HasOne(d => d.ToUser)
                    .WithMany(p => p.PaidByUserToUser)
                    .HasForeignKey(d => d.ToUserId)
                    .HasConstraintName("FK__PaidByUse__toUse__2EDAF651");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.PaidByUserUser)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__PaidByUse__userI__2DE6D218");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("payment");

                entity.Property(e => e.PaymentId).HasColumnName("paymentId");

                entity.Property(e => e.Amount)
                    .HasColumnName("amount")
                    .HasColumnType("decimal(9, 2)");

                entity.Property(e => e.Attachment)
                    .HasColumnName("attachment")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Createdby).HasColumnName("createdby");

                entity.Property(e => e.FromUserid).HasColumnName("fromUserid");

                entity.Property(e => e.GroupId).HasColumnName("groupId");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .IsUnicode(false);

                entity.Property(e => e.PaymentDate)
                    .HasColumnName("paymentDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.PaymentMode).HasColumnName("paymentMode");

                entity.Property(e => e.ToUserId).HasColumnName("toUserId");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updatedDate")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.CreatedbyNavigation)
                    .WithMany(p => p.PaymentCreatedbyNavigation)
                    .HasForeignKey(d => d.Createdby)
                    .HasConstraintName("FK__payment__created__46B27FE2");

                entity.HasOne(d => d.FromUser)
                    .WithMany(p => p.PaymentFromUser)
                    .HasForeignKey(d => d.FromUserid)
                    .HasConstraintName("FK__payment__fromUse__45BE5BA9");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Payment)
                    .HasForeignKey(d => d.GroupId)
                    .HasConstraintName("FK__payment__groupId__44CA3770");

                entity.HasOne(d => d.ToUser)
                    .WithMany(p => p.PaymentToUser)
                    .HasForeignKey(d => d.ToUserId)
                    .HasConstraintName("FK__payment__toUserI__43D61337");
            });

            modelBuilder.Entity<Status>(entity =>
            {
                entity.ToTable("status");

                entity.Property(e => e.StatusId).HasColumnName("statusId");

                entity.Property(e => e.Title)
                    .HasColumnName("title ")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserFriends>(entity =>
            {
                entity.Property(e => e.ActionUserId).HasColumnName("action_userId");

                entity.Property(e => e.AddedDate)
                    .HasColumnName("addedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.UpdatedDate)
                    .HasColumnName("updatedDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.UserOneId).HasColumnName("user_one_id");

                entity.Property(e => e.UserTwoId).HasColumnName("user_two_id");

                entity.HasOne(d => d.ActionUser)
                    .WithMany(p => p.UserFriendsActionUser)
                    .HasForeignKey(d => d.ActionUserId)
                    .HasConstraintName("FK__UserFrien__actio__6FE99F9F");

                entity.HasOne(d => d.StatusNavigation)
                    .WithMany(p => p.UserFriends)
                    .HasForeignKey(d => d.Status)
                    .HasConstraintName("FK__UserFrien__statu__70DDC3D8");

                entity.HasOne(d => d.UserOne)
                    .WithMany(p => p.UserFriendsUserOne)
                    .HasForeignKey(d => d.UserOneId)
                    .HasConstraintName("FK__UserFrien__user___6E01572D");

                entity.HasOne(d => d.UserTwo)
                    .WithMany(p => p.UserFriendsUserTwo)
                    .HasForeignKey(d => d.UserTwoId)
                    .HasConstraintName("FK__UserFrien__user___6EF57B66");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .HasColumnName("password")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.RegisteredDate)
                    .HasColumnName("registeredDate")
                    .HasColumnType("datetime");
            });
        }
    }
}
