using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHomeApp.Repositories
{
    public class ZoneDetailsDb
    {
        public int ZoneId { get; set; }
        public string ZoneName { get; set; }
        public int SensorId { get; set; }
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
