using Microsoft.EntityFrameworkCore;
using GiyimMagazasi.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Veritaban� ba�lam�n� (DbContext) ekle ve hassas verileri loglamay� etkinle�tir
builder.Services.AddDbContext<UygulamaDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage(); // Geliştirme ortamında detaylı hata sayfasını göster
}
else
{
    app.UseExceptionHandler("/Error"); // Üretim ortamında genel hata sayfasına yönlendir
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();