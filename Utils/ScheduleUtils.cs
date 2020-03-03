using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SmartHomeApp.Controllers;
using SmartHomeApp.Repositories;

namespace SmartHomeApp.Utils
{
    public class ScheduleUtils
    {
        private readonly ILogger<ScheduleController> _logger;
        private readonly IDataStore _dataStore;
        private readonly IMapper _mapper;

        public ScheduleUtils(ILogger<ScheduleController> logger, IDataStore dataStore, IMapper mapper)
        {
            _logger = logger;
            _dataStore = dataStore;
            _mapper = mapper;
        }

        public async Task AddToSchedule(short zoneId, string mode, ScheduleExternal scheduleExternal)
        {
            var scheduleToAdd = _mapper.Map<ScheduleInternal>(scheduleExternal);

            var existingSchedule = _mapper.Map<IEnumerable<ScheduleInternal>>(await _dataStore.GetSchedule(zoneId, mode));

            foreach (var existing in existingSchedule)
            {
                if (existing.StartTime >= scheduleToAdd.StartTime &&
                    existing.EndTime <= scheduleToAdd.EndTime)
                {
                    await _dataStore.DeleteSchedule(existing.ScheduleId);
                    continue;
                }

                if (existing.StartTime > scheduleToAdd.StartTime &&
                    existing.StartTime < scheduleToAdd.EndTime)
                {
                    existing.StartTime = scheduleToAdd.EndTime;
                    await _dataStore.UpdateSchedule(_mapper.Map<ScheduleDB>(existing));
                    continue;
                }

                if (existing.EndTime > scheduleToAdd.StartTime &&
                    existing.EndTime < scheduleToAdd.EndTime)
                {
                    existing.EndTime = scheduleToAdd.StartTime;
                    await _dataStore.UpdateSchedule(_mapper.Map<ScheduleDB>(existing));
                    continue;
                }

                if (scheduleToAdd.StartTime > existing.StartTime &&
                    scheduleToAdd.EndTime < existing.EndTime)
                {
                    var dBAfter = _mapper.Map<ScheduleDB>(existing);
                    dBAfter.Mode = mode;
                    dBAfter.StartTime = scheduleToAdd.EndTime.ToString();
                    dBAfter.ZoneId = zoneId;
                    await _dataStore.AddSchedule(dBAfter);
                    existing.EndTime = scheduleToAdd.StartTime;
                    await _dataStore.UpdateSchedule(_mapper.Map<ScheduleDB>(existing));
                }
            }
            
        }
    }
}
