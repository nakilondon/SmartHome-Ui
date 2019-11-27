using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartHomeApp.Repositories;

namespace SmartHomeApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ZoneController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IZoneDataStore _zoneDataStore;

        public ZoneController(ILogger<WeatherForecastController> logger, IZoneDataStore zoneDataStore)
        {
            _logger = logger;
            _zoneDataStore = zoneDataStore;
        }

        [HttpGet]
        public async Task<IEnumerable<Zone>> GetAll()
        {
            _logger.LogDebug("GetAll");
            var zones = new List<Zone>();
            var zoneDetailsDb = await _zoneDataStore.GetAllZones();

            foreach (var zoneDetailDb in zoneDetailsDb)
            {
                zones.Add(new Zone
                {
                    Name = zoneDetailDb.ZoneName,
                    Temperature = zoneDetailDb.CurrentTemperature,
                    Min = zoneDetailDb.Min,
                    Max = zoneDetailDb.Max,
                    Target = zoneDetailDb.Target,
                    Range = zoneDetailDb.TargetRange + zoneDetailDb.Target,
                    Heating = zoneDetailDb.Heating
                });
            }
            return zones;
        }
    }
}
