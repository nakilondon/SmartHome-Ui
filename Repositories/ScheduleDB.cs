using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHomeApp.Repositories
{
    public enum ScheduleMode{
        NonActive,
        HomeWeekday,
        HomeWeekend,
        AwayWeekend,
        AwayWeekday
    }
    
    public class ScheduleDB
    {
        public short ScheduleId { get; set; }
        public short ZoneId { get; set; }
        public string Mode { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public float TargetTemp { get; set; }

    }
}
