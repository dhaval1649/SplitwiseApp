using System;
using System.Collections.Generic;

namespace SplitWise.Models
{
    public partial class Category1
    {
        public Category1()
        {
            Category2 = new HashSet<Category2>();
        }

        public int Category1Id { get; set; }
        public string Title { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? AddedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public Users UpdatedByNavigation { get; set; }
        public ICollection<Category2> Category2 { get; set; }
    }
}
