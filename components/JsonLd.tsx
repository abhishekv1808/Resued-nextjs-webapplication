export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Reused | Simtech Computers",
    image: "https://reused.in/images/logo.png",
    "@id": "https://reused.in",
    url: "https://reused.in",
    telephone: "+919632178786",
    priceRange: "₹5000 - ₹100000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "680/58, 30th Cross, Swagath Rd, 4th T Block East",
      addressLocality: "Jayanagar",
      addressRegion: "Bengaluru",
      postalCode: "560041",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9279,
      longitude: 77.5939,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:30",
      closes: "20:30",
    },
    sameAs: [
      "https://www.instagram.com/reused_in",
      "https://www.facebook.com/reused.in",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
