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
    }
}
