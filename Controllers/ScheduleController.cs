using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartHomeApp.Repositories;
using SmartHomeApp.Utils;

namespace SmartHomeApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly ILogger<ScheduleController> _logger;
        private readonly IDataStore _dataStore;
        private readonly IMapper _mapper;
        private readonly ScheduleUtils _scheduleUtils;

        public ScheduleController(ILogger<ScheduleController> logger, IDataStore dataStore, IMapper mapper, ScheduleUtils scheduleUtils)
        {
            _logger = logger;
            _dataStore = dataStore;
            _mapper = mapper;
            _scheduleUtils = scheduleUtils;
        }


        [HttpGet("{id}/{mode}")]
        public async Task<IEnumerable<ScheduleExternal>> Get(short id, string mode)
        {
            _logger.LogDebug("Get");
           
            var schedules = new List<ScheduleExternal>();

            var schedulesDb = await _dataStore.GetSchedule(id, mode);

            foreach (var scheduleDb in schedulesDb)
            {
                schedules.Add(_mapper.Map<ScheduleExternal>(scheduleDb));
            }

            return schedules;
            
        }
        
        [HttpPost("{id}/{mode}")]
        public async Task<ActionResult> Add(short id, string mode, [FromBody] ScheduleExternal schedule )
        {
            _logger.LogDebug("add");

            var endTime = new ScheduleTime(schedule.EndTime);
            var startTime = new ScheduleTime(schedule.StartTime);

            if (!(startTime < endTime))
                return BadRequest("End time must be after start time");

            await _scheduleUtils.AddToSchedule(id, mode, schedule);

            var scheduleDb = new ScheduleDB
            { 
                ZoneId = id,
                Mode = mode,
                StartTime = schedule.StartTime,
                EndTime = schedule.EndTime,
                TargetTemp = schedule.TargetTemp
            };

            await _dataStore.AddSchedule(scheduleDb);

            return Ok();
        }
         
        [HttpDelete("{id}")]
        public async Task Delete(short id)
        {
            await _dataStore.DeleteSchedule(id);
        }
    }
}