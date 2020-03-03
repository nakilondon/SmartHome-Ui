using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartHomeApp.Repositories
{
    public interface IDataStore
    {
        Task<IEnumerable<ZoneDetailsDb>> GetAllZones();
        Task<ZoneDetailsDb> GetZone(short zoneId);
        Task<ZoneDetailsDb> UpdateZone(ZoneDetailsDb zoneDetails);
        Task<ZoneDetailsDb> AddZone(ZoneDetailsDb zoneDetails);
        Task DeleteZone(short zoneId);
        Task AddSchedule(ScheduleDB scheduleDb);
        Task<IEnumerable<ScheduleDB>> GetSchedule(short zoneId, string scheduleMode);
        Task DeleteSchedule(short scheduleId);
        Task UpdateSchedule(ScheduleDB scheduleDb);
    }
}
