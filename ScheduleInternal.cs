using SmartHomeApp.Utils;

namespace SmartHomeApp
{
    internal class ScheduleInternal
    {
        public short ScheduleId { get; set; }
        public ScheduleTime StartTime { get; set; }
        public ScheduleTime EndTime { get; set; }
        public float TargetTemp { get; set; }
    }
}