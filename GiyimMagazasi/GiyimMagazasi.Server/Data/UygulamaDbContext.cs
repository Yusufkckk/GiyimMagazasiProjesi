using Microsoft.EntityFrameworkCore;
using GiyimMagazasi.Server.Models;

namespace GiyimMagazasi.Server.Data
{
    public class UygulamaDbContext : DbContext
    {
        public UygulamaDbContext(DbContextOptions<UygulamaDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }


        // 🚀 Yeni Ekleme: Sipariş ve Sipariş Kalemleri (OrderItems) tabloları
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItemDto> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Order ve OrderItem arasındaki ilişkiyi tanımlıyoruz (Bire-Çok)
            modelBuilder.Entity<OrderItemDto>()
        .HasOne(oi => oi.Order)
        .WithMany(o => o.OrderItems)
        .HasForeignKey(oi => oi.OrderId);

            // OrderItem ve Product arasındaki ilişkiyi tanımlıyoruz (Bire-Çok)
            modelBuilder.Entity<OrderItemDto>()
        .HasOne(oi => oi.Product)
        .WithMany()
        .HasForeignKey(oi => oi.ProductId);
        }
    }
}