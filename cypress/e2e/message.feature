Feature: Mesaj Listeleme

  Scenario: Ana sayfada mesajları görme
    Given uygulama açıldığında
    When mesaj listesi yüklenirse
    Then kullanıcı mesajları görebilmelidir
