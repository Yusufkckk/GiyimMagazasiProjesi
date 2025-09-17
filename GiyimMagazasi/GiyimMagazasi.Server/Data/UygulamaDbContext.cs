using Microsoft.EntityFrameworkCore;

namespace GiyimMagazasi.Server.Data
{
    public class UygulamaDbContext : DbContext
    {
        public UygulamaDbContext(DbContextOptions<UygulamaDbContext> options) : base(options)
        {
        }

        // Modellerimizi buraya ekleyeceğiz.
        // public DbSet<Product> Products { get; set; }
    }
}