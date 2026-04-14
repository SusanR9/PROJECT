import "../App.css";

const blogs = [
  {
    id: 1,
    title: "Top 10 Fashion Trends 2026",
    desc: "Discover the latest fashion trends that are dominating 2026 and how you can style them effortlessly.",
  },
  {
    id: 2,
    title: "How to Style Casual Wear",
    desc: "Simple tips to upgrade your everyday outfits and look stylish without trying too hard.",
  },
  {
    id: 3,
    title: "Best Shoes for Every Occasion",
    desc: "From formal events to casual outings, find the perfect shoes for every moment.",
  },
  {
    id: 4,
    title: "Winter Fashion Essentials",
    desc: "Stay warm and stylish with these must-have winter fashion pieces.",
  },
];

const Blog = () => {
  return (
    <div className="blog-page">

      <h1>Fashion Blog ✨</h1>

      <div className="blog-list">
        {blogs.map((b) => (
          <div key={b.id} className="blog-item">

            <h2>{b.title}</h2>
            <p>{b.desc}</p>

            <button>Read More →</button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Blog;