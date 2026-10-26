
import React, { useState } from "react";

import UploadArea from "../components/UploadArea";

const categories = [
  {
    name: "Festivals",
    icon: "🎉",
    description: "Traditions & celebrations",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=85"
  },
  {
    name: "Events",
    icon: "🎟️",
    description: "Moments worth remembering",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=700&q=85"
  },
  {
    name: "Persons",
    icon: "📸",
    description: "Portraits & people",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&q=85"
  },
  {
    name: "Wildlife",
    icon: "🌿",
    description: "Nature in its element",
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=700&q=85"
  }
];

export default function Dashboard({
  user,
  notify
}) {
  const [
    selectedCategory,
    setSelectedCategory
  ] = useState(null);

  return (
    <main className="dashboard">
      <section className="dashboard-welcome">
        <div className="eyebrow">
          YOUR CREATIVE WORKSPACE
        </div>

        <h1>
          Good to see you <span>✳</span>
        </h1>

        <p>
          Choose a collection to start
          adding your best work.
        </p>
      </section>

      <section className="collections-section">
        <div className="section-heading">
          <h2>Explore collections</h2>
          <span>01 / 04</span>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              className={`category-card ${
                selectedCategory === category.name
                  ? "selected"
                  : ""
              }`}
              aria-pressed={
                selectedCategory === category.name
              }
              onClick={() =>
                setSelectedCategory(category.name)
              }
            >
              <img
                src={category.image}
                alt=""
                loading="lazy"
              />

              <div className="category-gradient" />

              <div className="category-top">
                <span>{category.icon}</span>
                <span>↗</span>
              </div>

              <div className="category-bottom">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="upload-section">
        <div className="section-heading">
          <h2>Upload studio</h2>

          <span>
            {selectedCategory ||
              "SELECT A COLLECTION"}
          </span>
        </div>

        {selectedCategory ? (
          <UploadArea
            key={selectedCategory}
            category={selectedCategory}
            notify={notify}
          />
        ) : (
          <div className="empty-upload">
            <div className="empty-icon">
              ✦
            </div>

            <h3>Ready when you are.</h3>

            <p>
              Select a collection above
              to upload photos or videos.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
