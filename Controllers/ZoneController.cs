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
    public class ZoneController : ControllerBase
    {
        private readonly ILogger<ZoneController> _logger;
        private readonly IDataStore _dataStore;
        private readonly IMapper _mapper;

        public ZoneController(ILogger<ZoneController> logger, IDataStore dataStore, IMapper mapper)
        {
            _logger = logger;
            _dataStore = dataStore;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<Zone>> Get()
        {
            _logger.LogDebug("Get");
            var zones = new List<Zone>();
            var zoneDetailsDb = await _dataStore.GetAllZones();

            foreach (var zoneDetailDb in zoneDetailsDb)
            {
                zones.Add(_mapper.Map<Zone>(zoneDetailDb));
            }

            return zones;
        }

        [HttpGet("{id}")]
        public async Task<Zone> Get(short id)
        {
            _logger.LogDebug("Get");

            var zoneDetailDb = await _dataStore.GetZone(id);

            return _mapper.Map<Zone>(zoneDetailDb);
        }

        [HttpPost("update")]
        public async Task<Zone> Update([FromBody] Zone zone)
        {
            _logger.LogDebug("update");

            var zoneDb = _mapper.Map<ZoneDetailsDb>(zone);

            await _dataStore.UpdateZone(zoneDb);

            return _mapper.Map<Zone>(await _dataStore.GetZone(zone.Id));
        }

        [HttpPost("add")]
        public async Task<Zone> Add([FromBody] Zone zone)
        {
            _logger.LogDebug("add");

            var zoneDb = _mapper.Map<ZoneDetailsDb>(zone);

            var zoneDetailsDb = await _dataStore.GetAllZones();
            zoneDb.ZoneId = (short)(zoneDetailsDb.Count() + 1);

            await _dataStore.AddZone(zoneDb);

            return _mapper.Map<Zone>(await _dataStore.GetZone(zone.Id));
        }

        [HttpDelete("{id}")]
        public async Task Delete(short id)
        {
            await _dataStore.DeleteZone(id);
        }
    }
}