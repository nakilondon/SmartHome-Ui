namespace SmartHomeApp
{
    public class ActionTime
    {
        public short Hour;
        public short Minute;
    }
    public class Action
    {
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public float TargetTemp { get; set; }
    }
    public class Schedule
    {
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public float TargetTemp { get; set; }
    }
}