# Shelfy API Dökümantasyonu

Bu belge, Frontend (Örn: Flutter) ve Backend servislerinin iletişim kurarken kullanacağı uç noktaları (Endpoints), HTTP metotlarını, Query parametrelerini ve JSON veri gövdelerini detaylı bir şekilde açıklamaktadır.

---

## 1. Yetkilendirme ve Standart Yanıt Formatı

### Zorunlu Başlık (Header)
Tüm isteklerde uygulamanın güvenliğini sağlamak için özel bir API anahtarı gönderilmesi zorunludur.

- **Key:** `x-api-key`
- **Value:** `.env` dosyasındaki `APP_API_KEY` değeri (Örn: `547e5a1a3da6df550...`)

### Standart Yanıt Yapısı (ApiResponse)
API'den dönen **TÜM** yanıtlar her zaman aşağıdaki standart JSON formatındadır:

**Başarılı Yanıt:**
```json
{
  "success": true,
  "message": "İşlem başarılı mesajı (opsiyonel)",
  "data": { ... } // veya [...]
}
```

**Hatalı Yanıt:**
```json
{
  "success": false,
  "message": "Kullanıcı dostu hata mesajı",
  "error": "Sistemsel/Teknik hata detayı"
}
```

---

## 2. Gelişmiş Filtreleme ve GET Parametreleri

`GET /api/media`, `GET /api/movies`, `GET /api/series`, ve `GET /api/print` uç noktalarında kullanılabilen ortak "Query" parametreleri aşağıdadır:

| Parametre | Tipi | Varsayılan | Açıklama | Örnek |
| --- | --- | --- | --- | --- |
| `page` | Integer | 1 | İstenen sayfa numarası (Pagination) | `?page=2` |
| `limit` | Integer | 10 | Sayfada kaç veri getirileceği | `?limit=20` |
| `type` | String | - | `MOVIE`, `SERIES`, `PRINT` (Sadece `/api/media` rotasında etkilidir) | `?type=MOVIE` |
| `status` | String | - | İzleme/Okuma durumu (`PLAN_TO_WATCH`, `WATCHING`, `COMPLETED`, vb.) | `?status=COMPLETED` |
| `genre` | String | - | İlgili tür ismine göre filtreleme | `?genre=Sci-Fi` |
| `is_favorite` | Boolean | - | Sadece favoriye eklenenleri (`true`) veya eklenmeyenleri (`false`) getirir | `?is_favorite=true` |
| `search` | String | - | Başlık (Title) veya Orijinal Başlık içinde metin araması | `?search=Batman` |
| `sortBy` | String | updated_at | `updated_at`, `created_at`, `title`, `release_year`, `user_rating` | `?sortBy=user_rating` |
| `order` | String | desc | `asc` (Artan) veya `desc` (Azalan) yönde sıralama | `?order=desc` |

**Birleştirilmiş Filtreleme Örneği:**
`GET /api/movies?is_favorite=true&status=COMPLETED&sortBy=user_rating&order=desc&limit=5`

---

## 3. Filmler (`/api/movies`)

### `GET /api/movies`
Tüm filmleri getirir. (Gelişmiş Filtreleme parametrelerini alır).

### `POST /api/movies`
Yeni bir film ekler.
- **Content-Type:** `multipart/form-data` (Kapak resmi eklenecekse), aksi halde `application/json`

**Örnek JSON Gövde (Resimsiz):**
```json
{
  "title": "Inception",
  "original_title": "Inception",
  "status": "COMPLETED",
  "release_year": 2010,
  "description": "Rüya içinde rüya.",
  "language": "English",
  "user_rating": 9.5,
  "is_favorite": true,
  "genres": ["Sci-Fi", "Action", "Thriller"],
  "duration_minutes": 148,
  "stopped_at_minute": 0,
  "is_watched": true,
  "director": "Christopher Nolan"
}
```

### `PUT /api/movies/:id`
Mevcut bir filmi günceller. Gövde POST ile aynıdır, yalnızca güncellenmek istenen alanlar gönderilir.

---

## 4. Diziler (`/api/series`)

### `GET /api/series`
Tüm dizileri getirir. (Gelişmiş Filtreleme parametrelerini alır).

### `POST /api/series`
Yeni bir dizi ekler. (`multipart/form-data` veya `application/json`)

**Örnek JSON Gövde:**
```json
{
  "title": "Breaking Bad",
  "status": "WATCHING",
  "release_year": 2008,
  "description": "Lise kimya öğretmeni uyuşturucu baronuna dönüşür.",
  "user_rating": 10.0,
  "is_favorite": true,
  "genres": ["Crime", "Drama", "Thriller"],
  "studio": "AMC"
}
```

### `PUT /api/series/:id`
Mevcut bir diziyi günceller. Sadece değişecek alanlar gönderilir.

---

## 5. Kitap ve Manga (`/api/print`)

### `GET /api/print`
Tüm Kitap, Manga veya Çizgi Romanları getirir. (Gelişmiş Filtreleme).

### `POST /api/print`
Yeni bir yayın ekler.

**Örnek JSON Gövde:**
```json
{
  "title": "Naruto Vol 1",
  "status": "WATCHING",
  "release_year": 1999,
  "user_rating": 8.5,
  "is_favorite": false,
  "genres": ["Shounen", "Action", "Ninja"],
  "author": "Masashi Kishimoto",
  "total_pages_or_chapters": 700,
  "current_progress": 150,
  "print_type": "Manga"
}
```

### `PUT /api/print/:id`
Yayın bilgilerini (Örn: Okunulan sayfa) günceller. Sadece değişecek alanlar gönderilir.

---

## 6. Sezonlar (`/api/seasons`)

### `GET /api/series/:id/seasons` (Diziye Ait Sezonları Getirme)
Bir dizinin tüm sezonlarını (ve içindeki bölümleriyle birlikte) sırasıyla getirir.
- Not: Bu rota `/api/series` altındadır.

### `POST /api/seasons` (Sezon Ekleme)
Diziye yeni bir sezon ekler.
- **Content-Type:** `application/json` (Kapak varsa `multipart/form-data`)

**Örnek JSON Gövde:**
```json
{
  "series_id": "dizinin_id_si_buraya_gelecek",
  "season_number": 1,
  "title": "1. Sezon",
  "user_rating": 8.0,
  "default_episode_duration": 45,
  "release_year": 2008
}
```

### `PUT /api/seasons/:id` (Sezon Güncelleme)
Sezon bilgisini günceller. (Aynı alanlar opsiyoneldir).

### `DELETE /api/seasons/:id` (Sezon Silme)
Sezonu ve altındaki tüm bölümleri veritabanından kalıcı olarak siler.

---

## 7. Bölümler (`/api/episodes`)

### `GET /api/seasons/:id/episodes` (Sezona Ait Bölümleri Getirme)
Bir sezonun tüm bölümlerini bölüm sırasına göre getirir.
- Not: Bu rota `/api/seasons` altındadır.

### `POST /api/episodes` (Bölüm Ekleme)
Sezona yeni bir bölüm ekler.
- **Content-Type:** `application/json`

**Örnek JSON Gövde:**
```json
{
  "season_id": "sezonun_id_si_buraya_gelecek",
  "episode_number": 1,
  "title": "Pilot",
  "duration_minutes": 58,
  "status": "WATCHED",
  "user_notes": "Harika bir başlangıç bölümüydü."
}
```

### `PUT /api/episodes/:id`
Bölümü (Süresi, izlendi durumu vb.) günceller.

### `DELETE /api/episodes/:id`
Bölümü kalıcı olarak siler.

---

## 8. Türler (`/api/genres`)

### `GET /api/genres`
Sistemdeki tüm türleri (Action, Sci-Fi vb.) alfabetik olarak ve içerdiği yayın sayısı ile birlikte (`_count.medias`) listeler.

### `POST /api/genres`
Yeni bir türü veritabanına manuel olarak ekler. (Not: Türler yayın eklerken otomatik de oluşur).

**Örnek JSON Gövde:**
```json
{
  "name": "Bilim Kurgu"
}
```

### `GET /api/genres/:id`
Spesifik bir türü ID'sine göre getirir.

### `PUT /api/genres/:id`
Tür ismini günceller.

**Örnek JSON Gövde:**
```json
{
  "name": "Sci-Fi (Bilim Kurgu)"
}
```

### `DELETE /api/genres/:id`
Kullanılmayan bir türü siler. İlişkili olduğu yayınlardan da bağını otomatik koparır.

---

## 9. Tüm Medyaları Yönetme (`/api/media`)

### `GET /api/media`
Film, Dizi ve Mangaları **aynı anda** sayfalama ve filtrelemeyle birlikte getirir. Anasayfa (Home) beslemesi için idealdir.

### `DELETE /api/media/:id`
Kullanıcı bir içeriği silmek istediğinde (`media_list_entries` tablosundaki `id`), türü ne olursa olsun (Film, Dizi, Manga) kalıcı olarak silinmesini sağlar. Altındaki tüm sezonlar ve bölümler de (Cascade sayesinde) silinir.
