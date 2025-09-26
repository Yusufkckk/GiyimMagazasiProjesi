using GiyimMagazasi.Server.Data;
using GiyimMagazasi.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace GiyimMagazasi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly UygulamaDbContext _context;

        public OrdersController(UygulamaDbContext context)
        {
            _context = context;
        }

        // POST: api/Orders (Front-End'deki Siparişi Tamamla butonu buraya istek gönderecek)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            // 1. Gelen siparişte ürün var mı kontrol et
            if (order == null || !order.OrderItems.Any())
            {
                return BadRequest("Sipariş öğesi bulunamadı.");
            }

            // Stok düşürme işlemi
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);

                if (product == null)
                {
                    return NotFound($"Ürün ID'si {item.ProductId} bulunamadı.");
                }

                if (product.Stock < item.Quantity)
                {
                    // Stok yetersizse 400 Bad Request dön
                    return BadRequest($"Ürün '{product.Name}' için yeterli stok yok. Mevcut: {product.Stock}");
                }

                // 2. Stoktan Düşür
                product.Stock -= item.Quantity;
                _context.Entry(product).State = EntityState.Modified;
            }

            try
            {
                // 3. Değişiklikleri veritabanına kaydet (Tüm stoklar tek Transaction'da güncellenir)
                await _context.SaveChangesAsync();

                // 4. Sipariş kaydını oluşturma (Opsiyonel, şimdilik stok odaklıyız)
                // Gerçek projede sipariş bilgileri (Order nesnesi) de veritabanına kaydedilmelidir.

                return Ok(new { message = "Sipariş başarıyla oluşturuldu ve stoklar güncellendi." });
            }
            catch (DbUpdateConcurrencyException)
            {
                // Concurrency hatası (aynı anda güncelleme)
                return StatusCode(500, "Stok güncellenirken bir çakışma oluştu. Lütfen tekrar deneyin.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu Hatası: {ex.Message}");
            }
        }
    }
}