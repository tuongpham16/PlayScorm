using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlayScorm.App.Models
{
    public class ScormTimespentViewModel
    {
        [Required]
        public Guid PackageId { get; set; }

        public Guid? ReferenceId { get; set; }

        public int TimeSpent { get; set; }
    }
}
