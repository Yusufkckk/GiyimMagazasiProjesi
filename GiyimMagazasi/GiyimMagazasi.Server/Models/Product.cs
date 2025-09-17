namespace GiyimMagazasi.Server.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string? Name { get; set; } // Soru işareti ekleyin
        public string? Description { get; set; } // Soru işareti ekleyin
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; } // Soru işareti ekleyin
        public string? Category { get; set; } // Soru işareti ekleyin
    }
}