using System;

namespace SmartHomeApp
{
    public class Zone
    {
        public string Name { get; set; }
        public float Temperature { get; set; }
        public float Min { get; set; }
        public float Max { get; set; }
        public float Target { get; set; }
        public float Range { get; set; }
        public bool Heating { get; set; }
    }
}