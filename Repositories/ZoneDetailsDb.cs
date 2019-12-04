using System;

namespace SmartHomeApp.Repositories
{
    public class ZoneDetailsDb
    {
        public short ZoneId { get; set; }
        public string ZoneName { get; set; }
        public string MqttTopic { get; set; }
        public bool Active { get; set; }
        public bool UseSensor { get; set; }
        public short SensorId { get; set; }
        public DateTime LastUpDate { get; set; }
        public float CurrentTemperature { get; set; }
        public float Target { get; set; }
        public float Min { get; set; }
        public float Max { get; set; }
        public float TargetRange { get; set; }
        public bool Heating { get; set; }
        public override string ToString()
        {
            return $"ZoneId: {ZoneId}\tZoneName: {ZoneName}\tSensorId: {SensorId}\tCurrentTemperature: {CurrentTemperature}\tLastUpdate: {LastUpDate}";
        }
    }
}
