using GiyimMagazasi.Server.Models; // Model sınıfların için
using GiyimMagazasi.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace GiyimMagazasi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UygulamaDbContext _context;

        public AuthController(UygulamaDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
        {
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { message = "Bu e-posta adresi zaten kayıtlı." });
            }

            var user = new User
            {
                Email = model.Email,
                Password = model.Password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kullanıcı başarıyla kaydedildi." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Geçersiz e-posta veya şifre." });
            }

            var token = Guid.NewGuid().ToString(); // Basit bir token oluşturma
            return Ok(new { token, message = "Giriş başarılı." });
        }

        // Yeni uç nokta: Token'dan kullanıcı bilgilerini çekme
        [HttpGet("me")]
        public async Task<IActionResult> GetUserInfo()
        {
            // İsteğin başlığından token'ı oku. Gerçek senaryoda bu token doğrulanır.
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "Token bulunamadı." });
            }

            // Basit bir örnek için, token'ı kullanıcının e-postası olarak kabul edelim.
            // Gerçek senaryoda, bu token'dan kullanıcı ID'si alınıp veritabanı sorgusu yapılır.
            var userEmail = "yusufkoçak@example.com"; // Burası mock veri
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            return Ok(new { email = user.Email });
        }
    }

    public class UserRegistrationModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserLoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}