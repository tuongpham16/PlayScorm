using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlayScorm.App.Models
{
    public class ScormItemState
    {
        public string ResourceUri { get; set; }
        public ComputerManagedInstruction Cmi { get; set; }

        [JsonIgnore]
        public DateTime AccessTime { get; set; }
    }

    public class ComputerManagedInstruction
    {
        public string CompletionStatus { get; set; }
        public string SuccessStatus { get; set; }
        public string Location { get; set; }
        public Score Score { get; set; }
        public string SessionTime { get; set; }
        public long TotalTime { get; set; }
        public string Exit { get; set; }
    }

    public class Score
    {
        public float Raw { get; set; }
        public float Min { get; set; }
        public float Max { get; set; }
    }


    public class ScormStateValueViewModel
    {
            public string PackageId { get; set; }
            public string ReferenceId { get; set; }
            public IList<ScormItemState> ItemStates { get; set; }
    }
}
