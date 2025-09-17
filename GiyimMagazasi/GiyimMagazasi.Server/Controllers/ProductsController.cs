using GiyimMagazasi.Server.Data;
using GiyimMagazasi.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly UygulamaDbContext _context;

    public ProductsController(UygulamaDbContext context) 
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        // Veritabanından tüm ürünleri al
        var products = await _context.Products.ToListAsync();

        // Eğer veritabanında ürün yoksa boş bir liste döndür
        if (products == null)
        {
            return new List<Product>();
        }

        // Ürünler varsa, onları döndür
        return products;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetProducts", new { id = product.Id }, product);
    }


}