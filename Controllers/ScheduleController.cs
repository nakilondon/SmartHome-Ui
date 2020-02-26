using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartHomeApp.Repositories;

namespace SmartHomeApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly ILogger<ZoneController> _logger;
        private readonly IZoneDataStore _zoneDataStore;
        private readonly IMapper _mapper;

        public ScheduleController(ILogger<ZoneController> logger, IZoneDataStore zoneDataStore, IMapper mapper)
        {
            _logger = logger;
            _zoneDataStore = zoneDataStore;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<Schedule> Get()
        {
            _logger.LogDebug("Get");
            var schedule = new Schedule
            {

            };

            return schedule;
        }

        [HttpGet("{id}/{mode}")]
        public async Task<Schedule[]> Get(short id, string mode)
        {
            _logger.LogDebug("Get");
            var schedule = new[]
            {
                new Schedule
                {
                    TargetTemp = 18.7f,
                    StartTime = "10:25",
                    EndTime = "17:07"
                },
                new Schedule
                {
                    StartTime = "18:10",
                    EndTime = "20:39",
                    TargetTemp = 19.8f
                }
            };

            return schedule;
        }

        [HttpPost("update")]
        public async Task<Zone> Update([FromBody] Zone zone)
        {
            _logger.LogDebug("update");

            var zoneDb = _mapper.Map<ZoneDetailsDb>(zone);

            await _zoneDataStore.UpdateZone(zoneDb);

            return _mapper.Map<Zone>(await _zoneDataStore.GetZone(zone.Id));
        }

        [HttpPost("add")]
        public async Task<Zone> Add([FromBody] Zone zone)
        {
            _logger.LogDebug("add");

            var zoneDb = _mapper.Map<ZoneDetailsDb>(zone);

            var zoneDetailsDb = await _zoneDataStore.GetAllZones();
            zoneDb.ZoneId = (short)(zoneDetailsDb.Count() + 1);

            await _zoneDataStore.AddZone(zoneDb);

            return _mapper.Map<Zone>(await _zoneDataStore.GetZone(zone.Id));
        }

        [HttpDelete("{id}")]
        public async Task Delete(short id)
        {
            await _zoneDataStore.DeleteZone(id);
        }
    }
}