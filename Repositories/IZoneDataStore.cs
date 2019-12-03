using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartHomeApp.Repositories
{
    public interface IZoneDataStore
    {
        Task<IEnumerable<ZoneDetailsDb>> GetAllZones();
        Task<ZoneDetailsDb> GetZone(short zoneId);
        Task<ZoneDetailsDb> UpdateZone(ZoneDetailsDb zoneDetails);
        Task<ZoneDetailsDb> AddZone(ZoneDetailsDb zoneDetails);
    }
}
