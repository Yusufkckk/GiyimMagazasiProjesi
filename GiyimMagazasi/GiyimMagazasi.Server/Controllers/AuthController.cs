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
        private readonly UygulamaDbContext _context; // Veritabanı context'ini enjekte et

        public AuthController(UygulamaDbContext context)
        {
            _context = context;
        }

        // Kayıt olma (Register) endpoint'i
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
                Password = model.Password // NOT: Gerçek projede şifre mutlaka hashlenmeli!
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kullanıcı başarıyla kaydedildi." });
        }

        // Giriş yapma (Login) endpoint'i
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Geçersiz e-posta veya şifre." });
            }

            // Başarılı giriş sonrası token oluşturma (JWT)
            // Şimdilik basit bir token döndürelim, daha sonra JWT'ye çevirebilirsin.
            var token = Guid.NewGuid().ToString();

            // Gerçek bir uygulamada bu token'ı veritabanına kaydedebilirsin.
            // Şimdi sadece client'a gönderiyoruz.
            return Ok(new { token, message = "Giriş başarılı." });
        }
    }

    // Kullanıcı kayıt modeli
    public class UserRegistrationModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    // Kullanıcı giriş modeli
    public class UserLoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}