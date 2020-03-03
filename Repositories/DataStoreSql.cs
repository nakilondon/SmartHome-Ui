using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace SmartHomeApp.Repositories
{
    public class DataStoreSql : IDataStore
    {
        private readonly string _connectionString;

        public DataStoreSql(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<ZoneDetailsDb>> GetAllZones()
        {
            using IDbConnection db = new MySqlConnection(_connectionString);
            return await db.QueryAsync<ZoneDetailsDb>("SELECT * FROM ZoneDetails");
        }

        public async Task<ZoneDetailsDb> GetZone(short zoneId)
        {
            using IDbConnection db = new MySqlConnection(_connectionString);
            return await db.QueryFirstOrDefaultAsync<ZoneDetailsDb>("SELECT * FROM ZoneDetails WHERE ZoneId = @id", new {id = zoneId});
        }

        public async Task<ZoneDetailsDb> UpdateZone(ZoneDetailsDb zoneDetails)
        {
            if (!await ZoneExists(zoneDetails.ZoneId))
            {
                throw new Exception($"Unable to find ZoneId: {zoneDetails.ZoneId} to update");
            }

            using IDbConnection db = new MySqlConnection(_connectionString);
            await db.ExecuteAsync(
                "UPDATE ZoneDetails SET ZoneName = @ZoneName, SensorId = @SensorId, LastUpdate = @LastUpdate, CurrentTemperature = @CurrentTemperature, Target = @Target, Min = @Min, Max = @Max, TargetRange = @TargetRange, Heating = @Heating, UseSensor = @UseSensor, Active = @Active, MqttTopic = @MqttTopic WHERE ZoneId = @ZoneId",
                zoneDetails);

            return await GetZone(zoneDetails.ZoneId);

        }

        public async Task<ZoneDetailsDb> AddZone(ZoneDetailsDb zoneDetails)
        {
            zoneDetails.LastUpDate = DateTime.Now;
            try
            {
                using IDbConnection db = new MySqlConnection(_connectionString);
                await db.ExecuteAsync("INSERT INTO ZoneDetails(ZoneId, ZoneName, MqttTopic, SensorId, LastUpdate, TargetRange) VALUES  (@ZoneId, @ZoneName, @MqttTopic, @SensorId, @LastUpdate, @TargetRange, @UseSensor )",
                    zoneDetails);
            }
            catch (Exception e)
            {
                throw e;
            }

            return await GetZone(zoneDetails.ZoneId);
        }

        public async Task DeleteZone(short zoneId)
        {
            using IDbConnection db = new MySqlConnection(_connectionString);
            await db.ExecuteAsync("DELETE FROM ZoneDetails WHERE ZoneId = @id", new { id = zoneId });

        }

        public async Task AddSchedule(ScheduleDB scheduleDb)
        {
            try
            {
                using IDbConnection db = new MySqlConnection(_connectionString);
                await db.ExecuteAsync(
                    "INSERT INTO Schedules(ZoneId, Mode, TargetTemp, StartTime, EndTime) VALUES  (@ZoneId, @Mode, @TargetTemp, @StartTime, @EndTime )",
                    scheduleDb);
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        public async Task<IEnumerable<ScheduleDB>> GetSchedule(short zoneId, string scheduleMode)
        {
            try
            {
                using IDbConnection db = new MySqlConnection(_connectionString);
                 
                return await db.QueryAsync<ScheduleDB>("SELECT * FROM Schedules WHERE ZoneId = @zoneId AND Mode = @mode ORDER BY StartTime",
                    new {zoneId = zoneId, mode = scheduleMode});

                
            } catch (Exception e)
            {
                throw e;
            }
        }

        public async Task DeleteSchedule(short scheduleId)
        {
            using IDbConnection db = new MySqlConnection(_connectionString);
            await db.ExecuteAsync("DELETE FROM Schedules WHERE ScheduleId = @ScheduleId",new {ScheduleId = scheduleId});
        }

        public async Task UpdateSchedule(ScheduleDB scheduleDb)
        {
            using IDbConnection db = new MySqlConnection(_connectionString);
            await db.ExecuteAsync(
                "UPDATE Schedules SET StartTime = @StartTime, EndTime = @EndTime, TargetTemp = @TargetTemp WHERE ScheduleId = @ScheduleId",
                scheduleDb);
        }

        public async Task<bool> ZoneExists(short zoneId)
        {
            using IDbConnection db = new MySqlConnection(_connectionString);
            var exists = await db.QueryAsync("SELECT COUNT(1) FROM ZoneDetails WHERE ZoneId = @id", new {id = zoneId});

            if (exists != null)
            {
                return true;
            }

            return false;
        }
    }
}
