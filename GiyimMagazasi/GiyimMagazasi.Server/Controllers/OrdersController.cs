using GiyimMagazasi.Server.Data;
using GiyimMagazasi.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;
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

        // POST: api/Orders
        [HttpPost]
        // ✅ DEĞİŞİKLİK: OrderDto'yu parametre olarak alıyoruz
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto orderDto)
        {
            // 1. Gelen siparişte ürün var mı kontrol et
            if (orderDto == null || orderDto.OrderItems == null || !orderDto.OrderItems.Any())
            {
                return BadRequest("Sipariş öğesi bulunamadı.");
            }

            // DTO'dan veritabanı modeline dönüşüm yapma
            var order = new Order
            {
                CustomerName = orderDto.CustomerName,
                CustomerAddress = orderDto.CustomerAddress,
                CustomerCity = orderDto.CustomerCity,
                CustomerEmail = orderDto.CustomerEmail,
                TotalAmount = orderDto.TotalAmount,
                OrderDate = DateTime.UtcNow,
                OrderItems = orderDto.OrderItems.Select(itemDto => new OrderItemDto
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity
                }).ToList()
            };

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
                    return BadRequest($"Ürün '{product.Name}' için yeterli stok yok. Mevcut: {product.Stock}");
                }

                product.Stock -= item.Quantity;
            }

            // Siparişi veritabanına kaydetme
            try
            {
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Sipariş başarıyla oluşturuldu ve stoklar güncellendi.", orderId = order.Id });
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Stok güncellenirken bir çakışma oluştu. Lütfen tekrar deneyin.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu Hatası: {ex.Message}");
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            try
            {
                // İlişkili verileri çekme
                var orders = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product) // Hatanın bu satırda olma olasılığı yüksek
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                if (orders == null || !orders.Any())
                {
                    return NotFound("Henüz sipariş bulunmamaktadır.");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Sunucu konsoluna hata detayını yazdır
                Console.WriteLine($"GetOrders metodunda hata oluştu: {ex.Message}");
                // DEBUG: Hata detayını tarayıcıya göndermek için
                return StatusCode(500, $"Sipariş verileri yüklenirken bir hata oluştu: {ex.Message}");
            }
        }
    }
    
}