﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace SmartHomeApp.Repositories
{
    public class ZoneDetailsSql : IZoneDataStore
    {
        private readonly string _connectionString;

        public ZoneDetailsSql(IConfiguration configuration)
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
            //"UPDATE ZoneDetails SET ZoneName = @zoneName, SensorId = @sensorId, LastUpdate = @lastUpdate, CurrentTemperature = @curTemp, Target = @target, Min = @min, Max = @max, TargetRange = @range, Heating = @Heating WHERE ZoneId = @id",
            //new
            //{
            //    id = zoneDetails.ZoneId, zoneName = zoneDetails.ZoneName, sensorId = zoneDetails.SensorId,
            //    lastUpdate = DateTime.Now, curTemp = zoneDetails.CurrentTemperature, target = zoneDetails.Target,
            //    min = zoneDetails.Min,
            //    max = zoneDetails.Max, range = zoneDetails.TargetRange, heating = zoneDetails.Heating
            //});
            "UPDATE ZoneDetails SET ZoneName = @ZoneName, SensorId = @SensorId, LastUpdate = @LastUpdate, CurrentTemperature = @CurrentTemperature, Target = @Target, Min = @Min, Max = @Max, TargetRange = @TargetRange, Heating = @Heating WHERE ZoneId = @ZoneId",
 zoneDetails);

            return await GetZone(zoneDetails.ZoneId);

        }

        public async Task<ZoneDetailsDb> AddZone(ZoneDetailsDb zoneDetails)
        {
            zoneDetails.LastUpDate = DateTime.Now;
            try
            {
                using IDbConnection db = new MySqlConnection(_connectionString);
                await db.ExecuteAsync("INSERT INTO ZoneDetails(ZoneId, ZoneName, SensorId, LastUpdate, TargetRange) VALUES  (@ZoneId, @ZoneName, @SensorId, @LastUpdate, @TargetRange )",
                    zoneDetails);
            }
            catch (Exception e)
            {
                throw e;
            }

            return await GetZone(zoneDetails.ZoneId);
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
