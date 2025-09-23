using GiyimMagazasi.Server.Models;
using GiyimMagazasi.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace GiyimMagazasi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UygulamaDbContext _context;
        private readonly IConfiguration _configuration; // IConfiguration'ı ekle

        public AuthController(UygulamaDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                Password = model.Password,
                Role = "user"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kullanıcı başarıyla kaydedildi." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

                if (user == null)
                {
                    return Unauthorized(new { message = "Geçersiz e-posta veya şifre." });
                }

                var claims = new[]
                {
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.Email, user.Email)
        };

                var token = CreateToken(claims);
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), message = "Giriş başarılı." });
            }
            catch (Exception ex)
            {
                // Olası bir hata durumunda (örneğin veritabanı bağlantı sorunu)
                return StatusCode(500, new { message = "Sunucu hatası: " + ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUserInfo()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { message = "E-posta bilgisi token'da bulunamadı." });
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            return Ok(new { email = user.Email, role = user.Role });
        }

        private JwtSecurityToken CreateToken(IEnumerable<Claim> claims)
        {
            // Anahtar, Issuer ve Audience değerlerini appsettings.json'dan al
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return token;
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