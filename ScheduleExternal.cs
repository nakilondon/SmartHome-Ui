namespace SmartHomeApp
{
    public class ScheduleExternal
    {
        public short ScheduleId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public float TargetTemp { get; set; }
    }
}