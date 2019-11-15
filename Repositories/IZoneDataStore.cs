using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartHomeApp.Repositories
{
    public interface IZoneDataStore
    {
        Task<IEnumerable<ZoneDetailsDb>> GetAllZones();
    }
}
