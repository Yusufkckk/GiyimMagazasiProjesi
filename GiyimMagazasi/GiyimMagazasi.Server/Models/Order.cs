namespace GiyimMagazasi.Server.Models
{
    // Front-End'den gelen sipariş verilerini temsil eder (DTO)
    public class Order
    {
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerEmail { get; set; }
        public decimal TotalAmount { get; set; }

        // Sipariş edilen ürünlerin listesi
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    }

    // Sepetteki her bir ürünü temsil eder (Stok düşürmek için gerekli)
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}