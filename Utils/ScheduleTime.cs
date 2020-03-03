using System;
using System.Globalization;
using System.Net.NetworkInformation;

namespace SmartHomeApp.Utils
{
    public class ScheduleTime
    {
        private short _hour;
        private short _minute;

        public ScheduleTime(string timeIn)
        {
            var seperatorPos = timeIn.IndexOf(":", StringComparison.Ordinal);
            _hour = Convert.ToInt16(timeIn.Substring(0, seperatorPos));
            _minute = Convert.ToInt16(timeIn.Substring(seperatorPos+1, 2));
        }

        public override string ToString()
        {
            return _hour.ToString("00") + ":" + _minute.ToString("00");
        }

        public static bool operator >(ScheduleTime a, ScheduleTime b)
        {
            if (a._hour > b._hour)
                return true;

            if (a._hour < b._hour)
                return false;

            if (a._minute > b._minute)
                return true;

            return false;
        }

        public static bool operator <(ScheduleTime a, ScheduleTime b)
        {
            if (a._hour < b._hour)
                return true;

            if (a._hour > b._hour)
                return false;

            if (a._minute < b._minute)
                return true;

            return false;
        }
        public static bool operator >=(ScheduleTime a, ScheduleTime b)
        {
            if (a._hour > b._hour)
                return true;

            if (a._hour < b._hour)
                return false;

            if (a._minute >= b._minute)
                return true;

            return false;
        }

        public static bool operator <=(ScheduleTime a, ScheduleTime b)
        {
            if (a._hour < b._hour)
                return true;

            if (a._hour > b._hour)
                return false;

            if (a._minute <= b._minute)
                return true;

            return false;
        }
    }
}