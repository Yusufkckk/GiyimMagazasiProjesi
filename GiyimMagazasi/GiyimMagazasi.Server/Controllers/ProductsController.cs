using GiyimMagazasi.Server.Data;
using GiyimMagazasi.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
// [Authorize(Roles = "admin")] <-- Bu satırı siliyoruz
public class ProductsController : ControllerBase
{
    private readonly UygulamaDbContext _context;

    public ProductsController(UygulamaDbContext context)
    {
        _context = context;
    }

    // Herkesin görebilmesi için bu metodun üstünde yetkilendirme etiketi yok.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }

    // Yalnızca adminlerin ürünleri güncelleyebilmesi için yetkilendirme ekledik
    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // Yalnızca adminlerin yeni ürün ekleyebilmesi için yetkilendirme ekledik
    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetProducts", new { id = product.Id }, product);
    }

    // Yalnızca adminlerin ürün silebilmesi için yetkilendirme ekledik
    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}