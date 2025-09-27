namespace GiyimMagazasi.Server.Models
{
    // Front-End'den gelecek sipariş verileri için DTO
    public class OrderDto
    {
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerEmail { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemCreateDto> OrderItems { get; set; }
    }

    // Front-End'den gelecek sipariş kalemleri için DTO
    public class OrderItemCreateDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}