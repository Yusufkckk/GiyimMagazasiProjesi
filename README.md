🛍️ Kocak Fashion - Tam Kapsamlı (Full-Stack) E-Ticaret Uygulaması
Bu proje, modern React ve TypeScript altyapısı üzerine kurulmuş, tüm e-ticaret süreçlerini yöneten, güvenli ve performans odaklı bir web uygulamasıdır. 
Başta Rol Tabanlı Erişim Kontrolü (RBAC) ve API Entegrasyonu olmak üzere, güncel frontend geliştirme standartlarını başarıyla uygulamaktadır.


🎯 Projenin Amacı ve Teknik Vizyonu
Projenin temel amacı, bir e-ticaret platformunun zorlu gereksinimlerini (güvenli oturum, dinamik sepet, koşullu arayüz) karşılayan, yüksek performanslı ve 
büyük ölçekte sürdürülebilir bir çözüm sunmaktır. Bu vizyona ulaşmak için geliştirme sürecinde tip güvenliği, modüler mimari ve API odaklı veri yönetimi önceliklendirilmiştir.

Frontend(React): Bileşen tabanlı, yeniden kullanılabilir ve dinamik kullanıcı arayüzü oluşturma.

Dil (TypeScript): Kod tabanında statik tip kontrolü uygulayarak çalışma zamanı hatalarını minimize etme ve kod kalitesini artırma.

Durum Yönetimi(React Context API):	Sepet verisi (Cart State) gibi global durumların merkezi, temiz ve ölçeklenebilir şekilde yönetimi.

Routing(React Router DOM):	Ürün detayları (/products/:id) ve kategoriler için dinamik ve SEO uyumlu URL yapısının oluşturulması.

API İletişimi(Fetch/Axios):	Asenkron veri çekme, gönderme ve API'dan dönen verilerin tip güvenliği ile yönetimi.


🔒 Güvenlik ve Yetkilendirme (RBAC) Sistemi
Projenin en kritik başarılarından biri, kullanıcı rollerine dayalı katı erişim kontrolünün uygulanmasıdır:

1.Rol Tabanlı Erişim Kontrolü (RBAC): 

    Kullanıcı girişi sonrası API'den alınan role (user veya admin) dayalı olarak tüm yetkilendirme ve arayüz mantığı belirlenmiştir.

    Oturum Güvenliği: authService üzerinden token/JWT bazlı oturum durumu (isAuthenticated) ve güvenli çıkış (logout) mekanizmaları yönetilmektedir.

2.Koşullu Render Etme (Conditional Rendering): 

    Arayüzdeki hassas elementler ve linkler, kullanıcının rolü kontrol edilerek koşullu olarak gösterilir/gizlenir.

    Yönetim Paneli (/admin) rotası ve bu alana yönlendiren menü linkleri, yalnızca admin rolüne sahip kullanıcılar için görünür hale getirilmiştir.

    Sipariş Geçmişi menü linki, yine aynı RBAC mantığı ile sadece yetkili (admin) kullanıcılara gösterilmiştir.
    

✨ Uygulanan Temel Fonksiyonlar ve Teknik Detaylar
1.Gelişmiş API Entegrasyonu:

    Ürün listelerinin, sipariş geçmişinin ve kullanıcı profillerinin farklı API uç noktalarından (/api/products, /api/orders, /api/users/profile) 
    asenkron olarak çekilmesi ve hataların yönetilmesi.

2.Dinamik UI/UX:

    Kullanıcının oturum durumuna göre anlık değişen Giriş/Çıkış butonu.

    Sepetteki ürün sayısını anlık yansıtan Dinamik Sepet Sayacı.

    Oturum açmış kullanıcılar için profil bilgileri ve yetkili linkleri içeren Ayarlar (Gear Icon) Açılır Menüsü geliştirilmiştir.

3.Veri İşleme ve Sunum:

    Kategori bazlı filtreleme ve fiyat artan/azalan gibi kriterlere dayalı yerel sıralama (sorting) mantığı geliştirilmiştir.

    ProductCard gibi temel bileşenler, performans odaklı render edilecek şekilde tasarlanmıştır.


✨ Öne Çıkan UX/UI Özellikleri
Gelişmiş Navigasyon: Kategoriler için açılır (dropdown) menü yapısı ve oturum yönetimi için 
dinamik Ayarlar İkonu ile çalışan bir profil menüsü entegre edilmiştir.

Dinamik UI: Giriş/Çıkış butonu, kullanıcının oturum durumuna göre anlık olarak değişir. 
Sepet sayacı, kullanıcının sepete eklediği ürün sayısını anlık olarak yansıtır.

Filtreleme ve Sıralama: Kullanıcıların ürünleri kategoriye göre filtrelemesi ve 
fiyat artan/azalan gibi kriterlere göre sıralayabilmesi için işlevsel arayüz elemanları sunulmuştur.
















