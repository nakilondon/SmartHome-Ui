namespace SmartHomeApp
{
    public class Zone
    {
        public short Id { get; set; }
        public string ZoneName { get; set; }
        public bool UseSensor { get; set; }
        public short SensorId { get; set; }
        public bool Active { get; set; }
        public float CurrentTemperature { get; set; }
        public float Target { get; set; }
        public float MinTemperature { get; set; }
        public float MaxTemperature { get; set; }
        public float Range { get; set; }
        public string LastUpdate { get; set; }
    }
}