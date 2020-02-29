using AutoMapper;
using SmartHomeApp.Repositories;

namespace SmartHomeApp.Utils
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Zone, ZoneDetailsDb>()
                .ForMember(d => d.ZoneId, opt => opt.MapFrom(s => s.Id))
                .ForMember(d => d.Max, opt => opt.MapFrom(s => s.MaxTemperature))
                .ForMember(d => d.Min, opt => opt.MapFrom(s => s.MinTemperature))
                .ForMember(d => d.TargetRange, opt => opt.MapFrom(s => s.Range));

            CreateMap<ZoneDetailsDb, Zone>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.ZoneId))
                .ForMember(d => d.MaxTemperature, opt => opt.MapFrom(s => s.Max))
                .ForMember(d => d.MinTemperature, opt => opt.MapFrom(s => s.Min))
                .ForMember(d => d.Range, opt => opt.MapFrom(s => s.TargetRange));

            CreateMap<ScheduleDB, Schedule>()
                .ForMember(d => d.StartTime, opt => opt.MapFrom(s => s.StartTime))
                .ForMember(d => d.EndTime, opt => opt.MapFrom(s => s.EndTime))
                .ForMember(d => d.TargetTemp, opt => opt.MapFrom(s => s.TargetTemp));


            CreateMap<Schedule, ScheduleDB>()
                .ForMember(d => d.ScheduleId, opt => opt.MapFrom(s => s.ScheduleId))
                .ForMember(d => d.StartTime, opt => opt.MapFrom(s => s.StartTime))
                .ForMember(d => d.EndTime, opt => opt.MapFrom(s => s.EndTime))
                .ForMember(d => d.TargetTemp, opt => opt.MapFrom(s => s.TargetTemp));
        }
    }
}
