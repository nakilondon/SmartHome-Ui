using System.Collections.Generic;
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
        private readonly IDataStore _dataStore;
        private readonly IMapper _mapper;

        public ScheduleController(ILogger<ZoneController> logger, IDataStore dataStore, IMapper mapper)
        {
            _logger = logger;
            _dataStore = dataStore;
            _mapper = mapper;
        }


        [HttpGet("{id}/{mode}")]
        public async Task<IEnumerable<Schedule>> Get(short id, string mode)
        {
            _logger.LogDebug("Get");
           
            var schedules = new List<Schedule>();

            var schedulesDb = await _dataStore.GetSchedule(id, mode);

            foreach (var scheduleDb in schedulesDb)
            {
                schedules.Add(_mapper.Map<Schedule>(scheduleDb));
            }

            return schedules;
            
        }
        
        [HttpPost("{id}/{mode}")]
        public async Task Add(short id, string mode, [FromBody] Schedule schedule )
        {
            _logger.LogDebug("add");

           var scheduleDb = new ScheduleDB
           {
               ZoneId = id,
               Mode = mode,
               StartTime = schedule.StartTime,
               EndTime = schedule.EndTime,
               TargetTemp = schedule.TargetTemp
           };

            await _dataStore.AddSchedule(scheduleDb);
        }
         
        [HttpDelete("{id}")]
        public async Task Delete(short id)
        {
            await _dataStore.DeleteSchedule(id);
        }
    }
}